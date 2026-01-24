import type * as Party from "partykit/server";
import { GameEngine } from "./game/GameEngine";
import {
  Player,
  VotingState,
  ClientMessage,
  ServerMessage,
  GameState,
  CollectedClue
} from "./data/types";

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
}

export default class GameRoom implements Party.Server {
  private state: RoomState;
  private voteTimer: ReturnType<typeof setInterval> | null = null;

  constructor(readonly room: Party.Room) {
    // Initialize room state - the room ID is the room code
    this.state = {
      roomCode: room.id.toUpperCase(),
      hostConnectionId: "",
      players: [],
      gameEngine: null,
      votingState: null,
      fidelityMode: false,
      createdAt: Date.now()
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
      const wasHost = this.state.hostConnectionId === conn.id;

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

    // Clear voting state
    this.state.votingState = null;

    this.broadcast({
      type: "vote-result",
      winner,
      allVotes,
      wasTiebreaker,
      gameState: this.state.gameEngine?.getPublicGameState() || {}
    });
  }

  private handleSearchLocation(conn: Party.Connection, locationId: string) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    const clue = this.state.gameEngine.search(locationId);

    this.broadcast({
      type: "search-result",
      clue,
      gameState: this.state.gameEngine.getPublicGameState()
    });
  }

  private handleTravel(conn: Party.Connection, destination: string) {
    if (!this.state.gameEngine) {
      this.send(conn, { type: "error", message: "Game not found" });
      return;
    }

    const result = this.state.gameEngine.travel(destination);

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

  // Helper method to send a message to a specific connection
  private send(conn: Party.Connection, message: ServerMessage) {
    conn.send(JSON.stringify(message));
  }

  // Helper method to broadcast a message to all connections
  private broadcast(message: ServerMessage) {
    this.room.broadcast(JSON.stringify(message));
  }
}
