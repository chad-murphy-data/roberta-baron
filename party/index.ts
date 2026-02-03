import type * as Party from "partykit/server";
import { GameEngine } from "./game/GameEngine";
import {
  Player,
  VotingState,
  ClientMessage,
  ServerMessage,
  GameState,
  CollectedClue,
  PendingClue,
  MindMeldState,
  MindMeldSubmission,
  MindMeldMatch,
  MiniGameType,
  PopularityState,
  PopularityVote,
  HighLowState,
  HighLowVote,
  HighLowContinueVote,
  Card
} from "./data/types";
import { getPromptForCity, calculateMatchPoints, calculateTimeBonus } from "./data/mindMeldPrompts";
import { getMatchupForCity, calculatePopularityTimeBonus } from "./data/popularityData";
import {
  createDeck,
  shuffleDeck,
  checkGuess,
  getMajorityVote,
  getContinueVoteMajority,
  calculateHighLowTimeBonus,
  toClientCard
} from "./data/highLowCards";

// Room state stored in the party
interface RoomState {
  roomCode: string;
  hostConnectionId: string;
  players: Player[];
  gameEngine: GameEngine | null;
  votingState: VotingState | null;
  fidelityMode: boolean;
  customVillain?: GameState['customVillain'];
  createdAt: number;
  // Asymmetric clue distribution
  pendingClues: PendingClue[];
  clueIdCounter: number;
  // Mini-games
  mindMeldState: MindMeldState | null;
  popularityState: PopularityState | null;
  highLowState: HighLowState | null;
  usedPopularityMatchups: string[];  // Track used matchup IDs for variety
}

export default class GameRoom implements Party.Server {
  private state: RoomState;
  private voteTimer: ReturnType<typeof setInterval> | null = null;
  private mindMeldTimer: ReturnType<typeof setInterval> | null = null;
  private popularityTimer: ReturnType<typeof setInterval> | null = null;
  private highLowTimer: ReturnType<typeof setInterval> | null = null;

  constructor(readonly room: Party.Room) {
    // Initialize room state - the room ID is the room code
    this.state = {
      roomCode: room.id.toUpperCase(),
      hostConnectionId: "",
      players: [],
      gameEngine: null,
      votingState: null,
      fidelityMode: false,
      createdAt: Date.now(),
      pendingClues: [],
      clueIdCounter: 0,
      mindMeldState: null,
      popularityState: null,
      highLowState: null,
      usedPopularityMatchups: []
    };
  }

  // Called when a new WebSocket connection is established
  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Client connected: ${conn.id} to room ${this.state.roomCode}`);

    // Check URL params for host creation
    const url = new URL(ctx.request.url);
    const isHost = url.searchParams.get("host") === "true";
    const hostName = url.searchParams.get("hostName");
    const fidelityMode = url.searchParams.get("fidelityMode") === "true";

    if (isHost && hostName && this.state.players.length === 0) {
      // This is the host creating the room
      this.state.hostConnectionId = conn.id;
      this.state.fidelityMode = fidelityMode;

      const host: Player = {
        id: `p-${Date.now()}`,
        name: hostName,
        connectionId: conn.id,
        isHost: true
      };

      this.state.players.push(host);

      // Pre-create game engine
      this.state.gameEngine = new GameEngine(fidelityMode);

      // Notify the host
      this.send(conn, {
        type: "room-joined",
        roomCode: this.state.roomCode,
        players: this.state.players,
        isHost: true
      });

      console.log(`Room ${this.state.roomCode} created by ${hostName}`);
    }
  }

  // Called when a WebSocket connection is closed
  onClose(conn: Party.Connection) {
    console.log(`Client disconnected: ${conn.id}`);

    const playerIndex = this.state.players.findIndex(p => p.connectionId === conn.id);

    if (playerIndex !== -1) {
      const disconnectedPlayer = this.state.players[playerIndex];
      const wasHost = this.state.hostConnectionId === conn.id;

      // Auto-share any unshared clues from the disconnected player
      this.autoSharePlayerClues(disconnectedPlayer.id, disconnectedPlayer.name);

      // Remove the player
      this.state.players.splice(playerIndex, 1);

      if (this.state.players.length === 0) {
        // Room is empty, clean up
        if (this.voteTimer) {
          clearInterval(this.voteTimer);
          this.voteTimer = null;
        }
        return;
      }

      // If host left, transfer host to next player
      if (wasHost && this.state.players.length > 0) {
        this.state.hostConnectionId = this.state.players[0].connectionId;
        this.state.players[0].isHost = true;
      }

      // Notify remaining players
      this.broadcast({
        type: "player-left",
        players: this.state.players
      });
    }
  }

  // Auto-share all unshared clues from a player (used when they disconnect)
  private autoSharePlayerClues(playerId: string, playerName: string) {
    const unsharedClues = this.state.pendingClues.filter(
      pc => pc.playerId === playerId && !pc.shared
    );

    for (const assignment of unsharedClues) {
      assignment.shared = true;

      // Add to collected clues in game engine
      if (this.state.gameEngine) {
        const clueWithSharer: CollectedClue = {
          ...assignment.clue,
          sharedBy: `${playerName} (auto-shared)`
        };
        this.state.gameEngine.addSharedClue(clueWithSharer);
      }

      // Count remaining unshared clues
      const unsharedCount = this.state.pendingClues.filter(p => !p.shared).length;

      // Broadcast to everyone
      this.broadcast({
        type: "clue-shared",
        clue: assignment.clue,
        sharedBy: `${playerName} (disconnected)`,
        gameState: this.state.gameEngine?.getPublicGameState() || {},
        unsharedCount
      });
    }
  }

  // Called when a message is received from a client
  onMessage(message: string, sender: Party.Connection) {
    try {
      const data = JSON.parse(message) as ClientMessage;

      switch (data.type) {
        case "join-room":
          this.handleJoinRoom(sender, data.playerName);
          break;
        case "start-game":
          this.handleStartGame(sender);
          break;
        case "proceed-from-intro":
          this.handleProceedFromIntro(sender);
          break;
        case "start-vote":
          this.handleStartVote(sender, data.prompt, data.options, data.votingType, data.duration);
          break;
        case "submit-vote":
          this.handleSubmitVote(sender, data.vote);
          break;
        case "search-location":
          this.handleSearchLocation(sender, data.locationId);
          break;
        case "travel":
          this.handleTravel(sender, data.destination);
          break;
        case "submit-to-pilot":
          this.handleSubmitToPilot(sender);
          break;
        case "get-state":
          this.handleGetState(sender);
          break;
        case "get-destinations":
          this.handleGetDestinations(sender);
          break;
        case "get-news":
          this.handleGetNews(sender);
          break;
        case "fly-back":
          this.handleFlyBack(sender);
          break;
        case "share-clue":
          this.handleShareClue(sender, data.clueId);
          break;
        case "mind-meld-submit":
          this.handleMindMeldSubmit(sender, data.answers);
          break;
        case "popularity-vote":
          this.handlePopularityVote(sender, data.choice);
          break;
        case "high-low-vote":
          this.handleHighLowVote(sender, data.choice);
          break;
        case "high-low-continue":
          this.handleHighLowContinue(sender, data.choice);
          break;
      }
    } catch (error) {
      console.error("Error handling message:", error);
      this.send(sender, { type: "error", message: "Invalid message format" });
    }
  }

  private handleJoinRoom(conn: Party.Connection, playerName: string) {
    // Check if game already started
    if (this.state.gameEngine) {
      const state = this.state.gameEngine.getState();
      if (state.gamePhase !== 'lobby') {
        this.send(conn, { type: "error", message: "Game already in progress" });
        return;
      }
    }

    // Check room capacity
    if (this.state.players.length >= 6) {
      this.send(conn, { type: "error", message: "Room is full (max 6 players)" });
      return;
    }

    // Check if name is taken
    if (this.state.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      this.send(conn, { type: "error", message: "Name already taken" });
      return;
    }

    // Add the player
    const player: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: playerName,
      connectionId: conn.id,
      isHost: false
    };

    this.state.players.push(player);

    // Notify the joining player
    this.send(conn, {
      type: "room-joined",
      roomCode: this.state.roomCode,
      players: this.state.players,
      isHost: false
    });

    // Notify all players in the room
    this.broadcast({
      type: "player-joined",
      players: this.state.players
    });

    console.log(`${playerName} joined room ${this.state.roomCode}`);
  }

  private handleStartGame(conn: Party.Connection) {
    if (this.state.hostConnectionId !== conn.id) {
      this.send(conn, { type: "error", message: "Only the host can start the game" });
      return;
    }

    if (this.state.players.length < 2) {
      this.send(conn, { type: "error", message: "Need at least 2 players to start" });
      return;
    }

    if (!this.state.gameEngine) {
      this.state.gameEngine = new GameEngine(this.state.fidelityMode, this.state.customVillain);
    }

    this.state.gameEngine.startGame();

    this.broadcast({
      type: "game-started",
      gameState: this.state.gameEngine.getPublicGameState()
    });

    console.log(`Game started in room ${this.state.roomCode}`);
  }

  private handleProceedFromIntro(conn: Party.Connection) {
    if (!this.state.gameEngine) return;

    this.state.gameEngine.proceedFromIntro();

    this.broadcast({
      type: "game-update",
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  private handleStartVote(
    conn: Party.Connection,
    prompt: string,
    options: string[],
    votingType: VotingState['votingType'],
    duration?: number
  ) {
    const voteDuration = duration || 20;

    this.state.votingState = {
      active: true,
      prompt,
      options,
      votes: {},
      timeRemaining: voteDuration,
      votingType
    };

    if (this.state.gameEngine) {
      const state = this.state.gameEngine.getState();
      // We need to modify the internal state to set gamePhase to 'voting'
      // This is a workaround since gamePhase is read-only from getState()
    }

    this.broadcast({
      type: "vote-started",
      prompt,
      options,
      votingType,
      duration: voteDuration
    });

    // Start vote timer
    this.startVoteTimer(voteDuration);
  }

  private startVoteTimer(duration: number) {
    let timeRemaining = duration;

    if (this.voteTimer) {
      clearInterval(this.voteTimer);
    }

    this.voteTimer = setInterval(() => {
      timeRemaining--;

      this.broadcast({ type: "vote-timer", timeRemaining });

      if (timeRemaining <= 0) {
        if (this.voteTimer) {
          clearInterval(this.voteTimer);
          this.voteTimer = null;
        }
        this.resolveVote();
      }
    }, 1000);
  }

  private handleSubmitVote(conn: Party.Connection, vote: string) {
    if (!this.state.votingState) {
      this.send(conn, { type: "error", message: "No active vote" });
      return;
    }

    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    if (!this.state.votingState.options.includes(vote)) {
      this.send(conn, { type: "error", message: "Invalid vote option" });
      return;
    }

    this.state.votingState.votes[player.id] = vote;

    // Broadcast vote update (without revealing who voted what)
    this.broadcast({
      type: "vote-update",
      votesReceived: Object.keys(this.state.votingState.votes).length,
      totalPlayers: this.state.players.length
    });

    // Check if all votes are in
    if (Object.keys(this.state.votingState.votes).length === this.state.players.length) {
      if (this.voteTimer) {
        clearInterval(this.voteTimer);
        this.voteTimer = null;
      }
      this.resolveVote();
    }
  }

  private resolveVote() {
    if (!this.state.votingState) return;

    // Count votes
    const voteCounts: Record<string, number> = {};
    for (const option of this.state.votingState.options) {
      voteCounts[option] = 0;
    }

    for (const vote of Object.values(this.state.votingState.votes)) {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    }

    // Find winner (tie-breaker: random)
    let maxVotes = 0;
    const winners: string[] = [];

    for (const [option, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        winners.length = 0;
        winners.push(option);
      } else if (count === maxVotes) {
        winners.push(option);
      }
    }

    // Check if there was a tie that needed breaking
    const wasTiebreaker = winners.length > 1;
    const winner = winners[Math.floor(Math.random() * winners.length)];
    const allVotes = { ...this.state.votingState.votes };
    const votingType = this.state.votingState.votingType;

    // If tiebreaker, find a player who voted for the winning option
    let tiebreakerPlayerName: string | undefined;
    if (wasTiebreaker) {
      // Find player IDs who voted for the winner
      const winningVoterIds = Object.entries(allVotes)
        .filter(([_, vote]) => vote === winner)
        .map(([playerId]) => playerId);

      // Pick a random one and find their name
      if (winningVoterIds.length > 0) {
        const randomVoterId = winningVoterIds[Math.floor(Math.random() * winningVoterIds.length)];
        const player = this.state.players.find(p => p.id === randomVoterId);
        tiebreakerPlayerName = player?.name;
      }
    }

    // Clear voting state
    this.state.votingState = null;

    // Execute the action based on vote type
    if (votingType === 'travel' && this.state.gameEngine) {
      // Actually perform the travel
      const result = this.state.gameEngine.travel(winner);

      // Clear pending clues when traveling (new city = fresh slate)
      this.state.pendingClues = [];

      this.broadcast({
        type: "vote-result",
        winner,
        allVotes,
        wasTiebreaker,
        tiebreakerPlayerName,
        gameState: this.state.gameEngine.getPublicGameState()
      });

      // Also send travel result for any additional handling
      this.broadcast({
        type: "travel-result",
        success: result.success,
        message: result.message,
        timeSpent: result.timeSpent,
        gameState: this.state.gameEngine.getPublicGameState()
      });

      // Trigger a random mini-game after successful travel to a new city
      // (not for the final city, and not if we went to the wrong city)
      if (result.success && !result.wrongCity) {
        const state = this.state.gameEngine.getState();
        // Only trigger mini-game if not at final destination (final is for arrest)
        if (state.currentCityIndex < state.companies.length - 1) {
          const currentCompany = state.companies[state.currentCityIndex];
          // Start random mini-game after a short delay (for travel animation)
          setTimeout(() => {
            this.startRandomMiniGame(currentCompany.city);
          }, 2000);
        }
      }
    } else if (votingType === 'pilot' && this.state.gameEngine && winner === 'Yes, file the ticket') {
      // Submit to Pilot for criminal identification
      const result = this.state.gameEngine.submitToAI([]);

      this.broadcast({
        type: "vote-result",
        winner,
        allVotes,
        wasTiebreaker,
        tiebreakerPlayerName,
        gameState: this.state.gameEngine.getPublicGameState()
      });

      this.broadcast({
        type: "pilot-result",
        identified: result.identified,
        message: result.message,
        possibleMatches: result.possibleMatches,
        gameState: this.state.gameEngine.getPublicGameState()
      });
    } else {
      // Default: just broadcast the vote result
      this.broadcast({
        type: "vote-result",
        winner,
        allVotes,
        wasTiebreaker,
        tiebreakerPlayerName,
        gameState: this.state.gameEngine?.getPublicGameState() || {}
      });
    }
  }

  private handleSearchLocation(conn: Party.Connection, locationId: string) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    // Find the searching player
    const searchingPlayer = this.state.players.find(p => p.connectionId === conn.id);
    if (!searchingPlayer) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    // Get all clues from this search (may be 1-2 clues: criminal + destination)
    const clues = this.state.gameEngine.searchWithMultipleClues(locationId);

    if (clues.length === 0) {
      // No clues found (already searched or other reason)
      this.broadcast({
        type: "search-result",
        clue: null,
        gameState: this.state.gameEngine.getPublicGameState()
      });
      return;
    }

    // Assign ALL clues to the searching player only
    const assignments: PendingClue[] = clues.map(clue => {
      this.state.clueIdCounter++;
      return {
        clueId: `clue-${this.state.clueIdCounter}`,
        clue: clue,
        playerId: searchingPlayer.id,
        playerName: searchingPlayer.name,
        shared: false
      };
    });

    // Store pending clues
    this.state.pendingClues.push(...assignments);

    // Send ALL clues to the searching player
    for (const assignment of assignments) {
      this.send(conn, {
        type: "private-clue",
        clue: assignment.clue,
        clueId: assignment.clueId
      });
    }

    // Send "no clue for you" to OTHER players
    for (const player of this.state.players) {
      if (player.id !== searchingPlayer.id) {
        const playerConn = this.findConnectionById(player.connectionId);
        if (playerConn) {
          this.send(playerConn, {
            type: "no-clue-for-you",
            message: `${searchingPlayer.name} found something! Ask them what they discovered.`
          });
        }
      }
    }

    // Broadcast to all (including host) that clues were discovered
    this.broadcast({
      type: "clues-discovered",
      count: clues.length,
      unsharedCount: clues.length,
      searcherName: searchingPlayer.name,
      message: `${searchingPlayer.name} found ${clues.length} clue${clues.length > 1 ? 's' : ''}!`
    });

    // Also send game state update (without adding clues to collected yet)
    this.broadcast({
      type: "search-result",
      clue: null, // Don't reveal the clue in broadcast
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  // Distribute clues to individual players (round-robin if more clues than players)
  private distributeClues(clues: CollectedClue[]): PendingClue[] {
    // Shuffle players to randomize who gets what
    const shuffledPlayers = [...this.state.players].sort(() => Math.random() - 0.5);

    const assignments: PendingClue[] = [];

    clues.forEach((clue, index) => {
      // Assign each clue to a different player (round-robin if more clues than players)
      const playerIndex = index % shuffledPlayers.length;
      const player = shuffledPlayers[playerIndex];

      this.state.clueIdCounter++;
      assignments.push({
        clueId: `clue-${this.state.clueIdCounter}`,
        clue: clue,
        playerId: player.id,
        playerName: player.name,
        shared: false
      });
    });

    return assignments;
  }

  // Find a connection by player ID
  private findConnectionByPlayerId(playerId: string): Party.Connection | null {
    const player = this.state.players.find(p => p.id === playerId);
    if (!player) return null;
    return this.findConnectionById(player.connectionId);
  }

  // Find a connection by connection ID
  private findConnectionById(connectionId: string): Party.Connection | null {
    for (const conn of this.room.getConnections()) {
      if (conn.id === connectionId) {
        return conn;
      }
    }
    return null;
  }

  // Handle when a player shares their clue with the team
  private handleShareClue(conn: Party.Connection, clueId: string) {
    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    const assignmentIndex = this.state.pendingClues.findIndex(
      a => a.clueId === clueId && a.playerId === player.id
    );

    if (assignmentIndex === -1) {
      this.send(conn, { type: "error", message: "Clue not found" });
      return;
    }

    const assignment = this.state.pendingClues[assignmentIndex];
    if (assignment.shared) {
      this.send(conn, { type: "error", message: "Clue already shared" });
      return;
    }

    // Mark as shared
    assignment.shared = true;

    // Add to collected clues in game engine with sharedBy info
    if (this.state.gameEngine) {
      const clueWithSharer: CollectedClue = {
        ...assignment.clue,
        sharedBy: player.name
      };
      this.state.gameEngine.addSharedClue(clueWithSharer);
    }

    // Count remaining unshared clues
    const unsharedCount = this.state.pendingClues.filter(p => !p.shared).length;

    // Broadcast to everyone
    this.broadcast({
      type: "clue-shared",
      clue: assignment.clue,
      sharedBy: player.name,
      gameState: this.state.gameEngine?.getPublicGameState() || {},
      unsharedCount
    });
  }

  private handleTravel(conn: Party.Connection, destination: string) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    const result = this.state.gameEngine.travel(destination);

    // Clear pending clues when traveling (new city = fresh slate)
    this.state.pendingClues = [];

    this.broadcast({
      type: "travel-result",
      success: result.success,
      message: result.message,
      timeSpent: result.timeSpent,
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  private handleSubmitToPilot(conn: Party.Connection) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    const result = this.state.gameEngine.submitToAI([]);

    this.broadcast({
      type: "pilot-result",
      identified: result.identified,
      message: result.message,
      possibleMatches: result.possibleMatches,
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  private handleGetState(conn: Party.Connection) {
    this.send(conn, {
      type: "game-state",
      gameState: this.state.gameEngine?.getPublicGameState() || null
    });
  }

  private handleGetDestinations(conn: Party.Connection) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "destination-options", options: [] });
      return;
    }

    this.send(conn, {
      type: "destination-options",
      options: this.state.gameEngine.getDestinationOptions()
    });
  }

  private handleGetNews(conn: Party.Connection) {
    if (!this.state.gameEngine) {
      this.send(conn, {
        type: "news-headline",
        headline: "BREAKING: Technical difficulties at news desk"
      });
      return;
    }

    this.send(conn, {
      type: "news-headline",
      headline: this.state.gameEngine.getNewsHeadline()
    });
  }

  private handleFlyBack(conn: Party.Connection) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    const result = this.state.gameEngine.flyBack();

    this.broadcast({
      type: "fly-back-result",
      success: result.success,
      message: result.message,
      timeSpent: result.timeSpent,
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  // ========== Mind Meld Mini-Game ==========

  // Start the Mind Meld mini-game for the current city
  public startMindMeld(cityName: string) {
    if (!this.state.gameEngine) return;

    const prompt = getPromptForCity(cityName);
    const timeLimit = 30; // seconds

    // Convert city name to slug for state
    const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    this.state.mindMeldState = {
      active: true,
      phase: 'input',
      prompt,
      citySlug,
      submissions: [],
      timeLimit,
      timeRemaining: timeLimit,
      startedAt: Date.now()
    };

    // Note: game phase is already set to 'miniGame' by startRandomMiniGame

    // Broadcast start to all players
    this.broadcast({
      type: "mind-meld-start",
      prompt,
      timeLimit
    });

    // Also send game state update with mindMeld state
    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        mindMeld: this.state.mindMeldState
      }
    });

    // Start the countdown timer
    this.startMindMeldTimer();
  }

  private startMindMeldTimer() {
    if (this.mindMeldTimer) {
      clearInterval(this.mindMeldTimer);
    }

    this.mindMeldTimer = setInterval(() => {
      if (!this.state.mindMeldState) {
        if (this.mindMeldTimer) {
          clearInterval(this.mindMeldTimer);
          this.mindMeldTimer = null;
        }
        return;
      }

      this.state.mindMeldState.timeRemaining--;

      // Broadcast timer update
      this.broadcast({
        type: "mind-meld-timer",
        timeRemaining: this.state.mindMeldState.timeRemaining
      });

      // Check if time is up
      if (this.state.mindMeldState.timeRemaining <= 0) {
        if (this.mindMeldTimer) {
          clearInterval(this.mindMeldTimer);
          this.mindMeldTimer = null;
        }
        this.resolveMindMeld();
      }
    }, 1000);
  }

  private handleMindMeldSubmit(conn: Party.Connection, answers: string[]) {
    if (!this.state.mindMeldState || this.state.mindMeldState.phase !== 'input') {
      this.send(conn, { type: "error", message: "Mind Meld not active" });
      return;
    }

    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    // Check if player already submitted
    if (this.state.mindMeldState.submissions.some(s => s.playerId === player.id)) {
      this.send(conn, { type: "error", message: "Already submitted" });
      return;
    }

    // Normalize answers: trim, lowercase, remove empty
    const normalizedAnswers = answers
      .map(a => a.trim().toLowerCase())
      .filter(a => a.length > 0)
      .slice(0, 3); // Max 3 answers

    // Remove duplicates from same player
    const uniqueAnswers = [...new Set(normalizedAnswers)];

    const submission: MindMeldSubmission = {
      playerId: player.id,
      playerName: player.name,
      answers: uniqueAnswers,
      submittedAt: Date.now()
    };

    this.state.mindMeldState.submissions.push(submission);

    // Broadcast player ready
    this.broadcast({
      type: "mind-meld-player-ready",
      playerId: player.id,
      playerName: player.name,
      readyCount: this.state.mindMeldState.submissions.length,
      totalPlayers: this.state.players.length
    });

    // Check if all players have submitted
    if (this.state.mindMeldState.submissions.length >= this.state.players.length) {
      if (this.mindMeldTimer) {
        clearInterval(this.mindMeldTimer);
        this.mindMeldTimer = null;
      }
      // Add a brief delay before revealing for drama
      setTimeout(() => this.resolveMindMeld(), 1000);
    }
  }

  private resolveMindMeld() {
    if (!this.state.mindMeldState || !this.state.gameEngine) return;

    // Calculate matches
    const matches = this.calculateMindMeldMatches(this.state.mindMeldState.submissions);

    // Calculate total points
    const totalPoints = matches.reduce((sum, m) => sum + m.points, 0);

    // Calculate time bonus (capped at 30 minutes)
    const timeBonus = calculateTimeBonus(totalPoints);

    // Update state
    this.state.mindMeldState.phase = 'revealing';
    this.state.mindMeldState.results = {
      matches,
      totalPoints,
      timeBonus
    };
    this.state.mindMeldState.revealIndex = 0;

    // Broadcast all results at once
    this.broadcast({
      type: "mind-meld-reveal",
      matches,
      totalPoints,
      timeBonus
    });

    // Update game state with Mind Meld state
    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        mindMeld: this.state.mindMeldState
      }
    });

    // Start revealing matches one by one with delays
    this.revealMatchesSequentially(matches, timeBonus);
  }

  private revealMatchesSequentially(matches: MindMeldMatch[], timeBonus: number) {
    let index = 0;

    const revealNext = () => {
      if (!this.state.mindMeldState) return;

      if (index < matches.length) {
        this.state.mindMeldState.revealIndex = index;

        this.broadcast({
          type: "mind-meld-reveal-next",
          matchIndex: index,
          match: matches[index]
        });

        index++;
        // 2.5 seconds between each match reveal
        setTimeout(revealNext, 2500);
      } else {
        // All matches revealed, complete the Mind Meld
        setTimeout(() => this.completeMindMeld(timeBonus), 2000);
      }
    };

    // Start revealing after a brief pause
    setTimeout(revealNext, 1500);
  }

  private completeMindMeld(timeBonus: number) {
    if (!this.state.mindMeldState || !this.state.gameEngine) return;

    // Apply time bonus
    const currentHours = this.state.gameEngine.getState().hoursRemaining;
    const newHours = currentHours + Math.floor(timeBonus / 60 * 10) / 10; // Convert minutes to hours (game uses hours)
    // Actually, looking at the game, hoursRemaining is the game time. We add minutes as fractional hours
    // timeBonus is in minutes, convert to hours
    const hoursToAdd = timeBonus / 60;
    this.state.gameEngine.addTime(hoursToAdd);

    const newHoursRemaining = this.state.gameEngine.getState().hoursRemaining;

    // Update phase
    this.state.mindMeldState.phase = 'complete';
    this.state.mindMeldState.active = false;

    // Broadcast completion
    this.broadcast({
      type: "mind-meld-complete",
      newHoursRemaining,
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        mindMeld: this.state.mindMeldState
      }
    });

    // After a delay, transition to searching phase
    setTimeout(() => {
      if (this.state.gameEngine) {
        this.state.gameEngine.setGamePhase('searching');
        this.state.mindMeldState = null;

        this.broadcast({
          type: "game-update",
          gameState: this.state.gameEngine.getPublicGameState()
        });
      }
    }, 3000);
  }

  private calculateMindMeldMatches(submissions: MindMeldSubmission[]): MindMeldMatch[] {
    // Collect all answers into a frequency map
    const answerData: Map<string, { playerIds: string[]; playerNames: string[] }> = new Map();

    submissions.forEach(sub => {
      sub.answers.forEach(answer => {
        if (!answer) return;

        const existing = answerData.get(answer);
        if (existing) {
          existing.playerIds.push(sub.playerId);
          existing.playerNames.push(sub.playerName);
        } else {
          answerData.set(answer, {
            playerIds: [sub.playerId],
            playerNames: [sub.playerName]
          });
        }
      });
    });

    // Find matches (answers with 2+ players)
    const matches: MindMeldMatch[] = [];
    answerData.forEach((data, answer) => {
      if (data.playerIds.length >= 2) {
        matches.push({
          answer,
          playerIds: data.playerIds,
          playerNames: data.playerNames,
          matchSize: data.playerIds.length,
          points: calculateMatchPoints(data.playerIds.length)
        });
      }
    });

    // Sort by match size (biggest first) then by points
    matches.sort((a, b) => b.matchSize - a.matchSize || b.points - a.points);

    return matches;
  }

  // ========== Mini-Game Selection ==========

  // Select and start a random mini-game for the current city
  private startRandomMiniGame(cityName: string) {
    if (!this.state.gameEngine) return;

    const gamesPlayed = this.state.gameEngine.getMiniGamesPlayed();
    const allGames: MiniGameType[] = ['mind_meld', 'popularity', 'high_low'];

    // Find games not yet played
    const unplayed = allGames.filter(g => !gamesPlayed.includes(g));

    // Pick randomly from unplayed, or least recent if all played
    let selected: MiniGameType;
    if (unplayed.length > 0) {
      selected = unplayed[Math.floor(Math.random() * unplayed.length)];
    } else {
      // All games played, pick the oldest one (first in the played list)
      selected = gamesPlayed[0];
    }

    // Record that we're playing this game
    this.state.gameEngine.recordMiniGamePlayed(selected);
    this.state.gameEngine.setActiveMiniGame(selected);
    this.state.gameEngine.setGamePhase('miniGame');

    // Start the selected game
    switch (selected) {
      case 'mind_meld':
        this.startMindMeld(cityName);
        break;
      case 'popularity':
        this.startPopularity(cityName);
        break;
      case 'high_low':
        this.startHighLow();
        break;
    }
  }

  // ========== Which is More Popular Mini-Game ==========

  private startPopularity(cityName: string) {
    if (!this.state.gameEngine) return;

    // Get a matchup for this city
    const matchup = getMatchupForCity(cityName, this.state.usedPopularityMatchups);
    if (!matchup) {
      // Fallback to searching if no matchups available (shouldn't happen)
      this.state.gameEngine.setGamePhase('searching');
      this.broadcast({
        type: "game-update",
        gameState: this.state.gameEngine.getPublicGameState()
      });
      return;
    }

    // Track used matchup
    this.state.usedPopularityMatchups.push(matchup.id);

    const timeLimit = 15; // seconds

    this.state.popularityState = {
      active: true,
      phase: 'voting',
      matchup,
      votes: [],
      timeLimit,
      timeRemaining: timeLimit,
      startedAt: Date.now()
    };

    // Broadcast start (without revealing winner)
    const matchupWithoutWinner = {
      id: matchup.id,
      cities: matchup.cities,
      category: matchup.category,
      optionA: matchup.optionA,
      optionB: matchup.optionB
    };

    this.broadcast({
      type: "popularity-start",
      matchup: matchupWithoutWinner,
      timeLimit
    });

    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        activeMiniGame: 'popularity',
        popularity: {
          ...this.state.popularityState,
          matchup: matchupWithoutWinner as any  // Don't expose winner to clients
        }
      }
    });

    this.startPopularityTimer();
  }

  private startPopularityTimer() {
    if (this.popularityTimer) {
      clearInterval(this.popularityTimer);
    }

    this.popularityTimer = setInterval(() => {
      if (!this.state.popularityState) {
        if (this.popularityTimer) {
          clearInterval(this.popularityTimer);
          this.popularityTimer = null;
        }
        return;
      }

      this.state.popularityState.timeRemaining--;

      this.broadcast({
        type: "popularity-timer",
        timeRemaining: this.state.popularityState.timeRemaining
      });

      if (this.state.popularityState.timeRemaining <= 0) {
        if (this.popularityTimer) {
          clearInterval(this.popularityTimer);
          this.popularityTimer = null;
        }
        this.resolvePopularity();
      }
    }, 1000);
  }

  private handlePopularityVote(conn: Party.Connection, choice: 'A' | 'B') {
    if (!this.state.popularityState || this.state.popularityState.phase !== 'voting') {
      this.send(conn, { type: "error", message: "Popularity game not active" });
      return;
    }

    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    // Check if already voted
    if (this.state.popularityState.votes.some(v => v.playerId === player.id)) {
      this.send(conn, { type: "error", message: "Already voted" });
      return;
    }

    const vote: PopularityVote = {
      playerId: player.id,
      playerName: player.name,
      choice
    };

    this.state.popularityState.votes.push(vote);

    this.broadcast({
      type: "popularity-player-voted",
      playerId: player.id,
      playerName: player.name,
      votedCount: this.state.popularityState.votes.length,
      totalPlayers: this.state.players.length
    });

    // Check if all players voted
    if (this.state.popularityState.votes.length >= this.state.players.length) {
      if (this.popularityTimer) {
        clearInterval(this.popularityTimer);
        this.popularityTimer = null;
      }
      setTimeout(() => this.resolvePopularity(), 1000);
    }
  }

  private resolvePopularity() {
    if (!this.state.popularityState || !this.state.gameEngine) return;

    const { matchup, votes } = this.state.popularityState;

    // Calculate results
    const correctPlayers: string[] = [];
    const incorrectPlayers: string[] = [];

    votes.forEach(vote => {
      if (vote.choice === matchup.winner) {
        correctPlayers.push(vote.playerName);
      } else {
        incorrectPlayers.push(vote.playerName);
      }
    });

    const teamScore = correctPlayers.length;
    const timeBonus = calculatePopularityTimeBonus(correctPlayers.length, this.state.players.length);

    this.state.popularityState.phase = 'reveal';
    this.state.popularityState.results = {
      correctPlayers,
      incorrectPlayers,
      teamScore,
      timeBonus
    };

    // Broadcast reveal with full matchup (including winner)
    this.broadcast({
      type: "popularity-reveal",
      matchup,
      results: this.state.popularityState.results,
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        popularity: this.state.popularityState
      }
    });

    // After delay, complete the game
    setTimeout(() => this.completePopularity(timeBonus), 4000);
  }

  private completePopularity(timeBonus: number) {
    if (!this.state.popularityState || !this.state.gameEngine) return;

    // Apply time bonus
    const hoursToAdd = timeBonus / 60;
    this.state.gameEngine.addTime(hoursToAdd);

    const newHoursRemaining = this.state.gameEngine.getState().hoursRemaining;

    this.state.popularityState.phase = 'complete';
    this.state.popularityState.active = false;

    this.broadcast({
      type: "popularity-complete",
      newHoursRemaining,
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        popularity: this.state.popularityState
      }
    });

    // Transition to searching after delay
    setTimeout(() => {
      if (this.state.gameEngine) {
        this.state.gameEngine.setGamePhase('searching');
        this.state.gameEngine.setActiveMiniGame(undefined);
        this.state.popularityState = null;

        this.broadcast({
          type: "game-update",
          gameState: this.state.gameEngine.getPublicGameState()
        });
      }
    }, 3000);
  }

  // ========== High-Low Card Mini-Game ==========

  private startHighLow() {
    if (!this.state.gameEngine) return;

    // Create and shuffle deck
    const deck = shuffleDeck(createDeck());

    // Draw first card
    const currentCard = deck.pop()!;

    const timeLimit = 15; // seconds per round

    this.state.highLowState = {
      active: true,
      phase: 'voting',
      deck,
      currentCard,
      streak: 0,
      timeBanked: 0,
      votes: [],
      continueVotes: [],
      timeLimit,
      timeRemaining: timeLimit,
      startedAt: Date.now()
    };

    this.broadcast({
      type: "high-low-start",
      currentCard: toClientCard(currentCard),
      streak: 0,
      timeBanked: 0,
      timeLimit
    });

    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        activeMiniGame: 'high_low',
        highLow: {
          ...this.state.highLowState,
          deck: []  // Don't expose deck to clients
        }
      }
    });

    this.startHighLowTimer();
  }

  private startHighLowTimer() {
    if (this.highLowTimer) {
      clearInterval(this.highLowTimer);
    }

    this.highLowTimer = setInterval(() => {
      if (!this.state.highLowState) {
        if (this.highLowTimer) {
          clearInterval(this.highLowTimer);
          this.highLowTimer = null;
        }
        return;
      }

      this.state.highLowState.timeRemaining--;

      this.broadcast({
        type: "high-low-timer",
        timeRemaining: this.state.highLowState.timeRemaining
      });

      if (this.state.highLowState.timeRemaining <= 0) {
        if (this.highLowTimer) {
          clearInterval(this.highLowTimer);
          this.highLowTimer = null;
        }

        // Handle timeout based on current phase
        if (this.state.highLowState.phase === 'voting') {
          this.resolveHighLowRound();
        } else if (this.state.highLowState.phase === 'continue_vote') {
          this.resolveContinueVote();
        }
      }
    }, 1000);
  }

  private handleHighLowVote(conn: Party.Connection, choice: 'higher' | 'lower') {
    if (!this.state.highLowState || this.state.highLowState.phase !== 'voting') {
      this.send(conn, { type: "error", message: "High-Low game not in voting phase" });
      return;
    }

    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    // Check if already voted
    if (this.state.highLowState.votes.some(v => v.playerId === player.id)) {
      this.send(conn, { type: "error", message: "Already voted" });
      return;
    }

    const vote: HighLowVote = {
      playerId: player.id,
      playerName: player.name,
      choice
    };

    this.state.highLowState.votes.push(vote);

    this.broadcast({
      type: "high-low-player-voted",
      playerId: player.id,
      playerName: player.name,
      votedCount: this.state.highLowState.votes.length,
      totalPlayers: this.state.players.length
    });

    // Check if all players voted
    if (this.state.highLowState.votes.length >= this.state.players.length) {
      if (this.highLowTimer) {
        clearInterval(this.highLowTimer);
        this.highLowTimer = null;
      }
      setTimeout(() => this.resolveHighLowRound(), 1000);
    }
  }

  private resolveHighLowRound() {
    if (!this.state.highLowState || !this.state.gameEngine) return;

    // Get majority vote (or random if tie)
    const teamChoice = getMajorityVote(this.state.highLowState.votes);

    // Draw next card
    let nextCard = this.state.highLowState.deck.pop();

    // Handle empty deck (shouldn't happen with 52 cards, but just in case)
    if (!nextCard) {
      this.completeHighLow('cashed_out');
      return;
    }

    // Check result
    let result = checkGuess(this.state.highLowState.currentCard, nextCard, teamChoice);

    // Handle push (same rank) - draw another card
    while (result === 'push' && this.state.highLowState.deck.length > 0) {
      nextCard = this.state.highLowState.deck.pop()!;
      result = checkGuess(this.state.highLowState.currentCard, nextCard, teamChoice);
    }

    this.state.highLowState.nextCard = nextCard;
    this.state.highLowState.lastResult = result;
    this.state.highLowState.teamChoice = teamChoice;
    this.state.highLowState.phase = 'reveal';

    if (result === 'correct') {
      this.state.highLowState.streak++;
      this.state.highLowState.timeBanked = calculateHighLowTimeBonus(this.state.highLowState.streak);
    }

    const canContinue = result === 'correct' && this.state.highLowState.deck.length > 0;

    this.broadcast({
      type: "high-low-reveal",
      currentCard: toClientCard(this.state.highLowState.currentCard),
      nextCard: toClientCard(nextCard),
      result,
      teamChoice,
      newStreak: this.state.highLowState.streak,
      timeBanked: this.state.highLowState.timeBanked,
      canContinue
    });

    // Update game state
    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        highLow: {
          ...this.state.highLowState,
          deck: []
        }
      }
    });

    if (result === 'wrong') {
      // Game over - wrong guess
      setTimeout(() => this.completeHighLow('wrong'), 3000);
    } else if (canContinue) {
      // Start continue vote after reveal
      setTimeout(() => this.startContinueVote(), 2500);
    } else {
      // No more cards or push exhausted deck
      setTimeout(() => this.completeHighLow('cashed_out'), 3000);
    }
  }

  private startContinueVote() {
    if (!this.state.highLowState || !this.state.gameEngine) return;

    this.state.highLowState.phase = 'continue_vote';
    this.state.highLowState.continueVotes = [];
    this.state.highLowState.timeRemaining = 10; // 10 seconds to decide

    this.broadcast({
      type: "high-low-continue-vote-start",
      timeLimit: 10
    });

    this.broadcast({
      type: "game-update",
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        highLow: {
          ...this.state.highLowState,
          deck: []
        }
      }
    });

    this.startHighLowTimer();
  }

  private handleHighLowContinue(conn: Party.Connection, choice: 'continue' | 'cash_out') {
    if (!this.state.highLowState || this.state.highLowState.phase !== 'continue_vote') {
      this.send(conn, { type: "error", message: "Not in continue vote phase" });
      return;
    }

    const player = this.state.players.find(p => p.connectionId === conn.id);
    if (!player) {
      this.send(conn, { type: "error", message: "Player not found" });
      return;
    }

    // Check if already voted
    if (this.state.highLowState.continueVotes.some(v => v.playerId === player.id)) {
      this.send(conn, { type: "error", message: "Already voted" });
      return;
    }

    const vote: HighLowContinueVote = {
      playerId: player.id,
      playerName: player.name,
      choice
    };

    this.state.highLowState.continueVotes.push(vote);

    this.broadcast({
      type: "high-low-continue-player-voted",
      playerId: player.id,
      playerName: player.name,
      votedCount: this.state.highLowState.continueVotes.length,
      totalPlayers: this.state.players.length
    });

    // Check if all players voted
    if (this.state.highLowState.continueVotes.length >= this.state.players.length) {
      if (this.highLowTimer) {
        clearInterval(this.highLowTimer);
        this.highLowTimer = null;
      }
      setTimeout(() => this.resolveContinueVote(), 500);
    }
  }

  private resolveContinueVote() {
    if (!this.state.highLowState || !this.state.gameEngine) return;

    const decision = getContinueVoteMajority(this.state.highLowState.continueVotes);

    if (decision === 'cash_out') {
      this.completeHighLow('cashed_out');
    } else {
      // Continue - set up next round
      this.state.highLowState.currentCard = this.state.highLowState.nextCard!;
      this.state.highLowState.nextCard = undefined;
      this.state.highLowState.phase = 'voting';
      this.state.highLowState.votes = [];
      this.state.highLowState.continueVotes = [];
      this.state.highLowState.timeRemaining = this.state.highLowState.timeLimit;

      this.broadcast({
        type: "high-low-start",
        currentCard: toClientCard(this.state.highLowState.currentCard),
        streak: this.state.highLowState.streak,
        timeBanked: this.state.highLowState.timeBanked,
        timeLimit: this.state.highLowState.timeLimit
      });

      this.broadcast({
        type: "game-update",
        gameState: {
          ...this.state.gameEngine.getPublicGameState(),
          highLow: {
            ...this.state.highLowState,
            deck: []
          }
        }
      });

      this.startHighLowTimer();
    }
  }

  private completeHighLow(reason: 'wrong' | 'cashed_out') {
    if (!this.state.highLowState || !this.state.gameEngine) return;

    if (this.highLowTimer) {
      clearInterval(this.highLowTimer);
      this.highLowTimer = null;
    }

    const finalStreak = this.state.highLowState.streak;
    const timeBonus = this.state.highLowState.timeBanked;

    // Apply time bonus
    const hoursToAdd = timeBonus / 60;
    this.state.gameEngine.addTime(hoursToAdd);

    const newHoursRemaining = this.state.gameEngine.getState().hoursRemaining;

    this.state.highLowState.phase = 'complete';
    this.state.highLowState.active = false;
    this.state.highLowState.results = {
      finalStreak,
      timeBonus,
      reason
    };

    this.broadcast({
      type: "high-low-complete",
      finalStreak,
      timeBonus,
      reason,
      newHoursRemaining,
      gameState: {
        ...this.state.gameEngine.getPublicGameState(),
        highLow: {
          ...this.state.highLowState,
          deck: []
        }
      }
    });

    // Transition to searching after delay
    setTimeout(() => {
      if (this.state.gameEngine) {
        this.state.gameEngine.setGamePhase('searching');
        this.state.gameEngine.setActiveMiniGame(undefined);
        this.state.highLowState = null;

        this.broadcast({
          type: "game-update",
          gameState: this.state.gameEngine.getPublicGameState()
        });
      }
    }, 3000);
  }

  // Helper method to send a message to a specific connection
  private send(conn: Party.Connection, message: ServerMessage) {
    conn.send(JSON.stringify(message));
  }

  // Helper method to broadcast a message to all connections
  private broadcast(message: ServerMessage) {
    this.room.broadcast(JSON.stringify(message));
  }
}
