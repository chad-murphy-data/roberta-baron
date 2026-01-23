import { Room, Player, VotingState, GameState, CollectedClue, LOCATIONS_BY_INDUSTRY } from './data/types.js';
import { GameEngine } from './game/GameEngine.js';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private gameEngines: Map<string, GameEngine> = new Map();
  private voteTimers: Map<string, NodeJS.Timeout> = new Map();

  generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I and O to avoid confusion
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    // Ensure uniqueness
    if (this.rooms.has(code)) {
      return this.generateRoomCode();
    }
    return code;
  }

  createRoom(
    hostSocketId: string,
    hostName: string,
    fidelityMode: boolean = false,
    customVillain?: GameState['customVillain']
  ): Room {
    const roomCode = this.generateRoomCode();

    const host: Player = {
      id: `p-${Date.now()}`,
      name: hostName,
      socketId: hostSocketId,
      isHost: true
    };

    const room: Room = {
      roomCode,
      hostSocketId,
      players: [host],
      gameState: null,
      votingState: null,
      createdAt: new Date()
    };

    this.rooms.set(roomCode, room);

    // Pre-create game engine (will be started when game begins)
    const engine = new GameEngine(fidelityMode, customVillain);
    this.gameEngines.set(roomCode, engine);

    return room;
  }

  joinRoom(
    roomCode: string,
    socketId: string,
    playerName: string
  ): { success: boolean; message?: string; room?: Room } {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, message: 'Room not found' };
    }

    if (room.gameState && room.gameState.gamePhase !== 'lobby') {
      return { success: false, message: 'Game already in progress' };
    }

    if (room.players.length >= 6) {
      return { success: false, message: 'Room is full (max 6 players)' };
    }

    // Check if name is taken
    if (room.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      return { success: false, message: 'Name already taken' };
    }

    const player: Player = {
      id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: playerName,
      socketId
    };

    room.players.push(player);

    return { success: true, room };
  }

  startGame(roomCode: string, socketId: string): { success: boolean; message?: string } {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, message: 'Room not found' };
    }

    if (room.hostSocketId !== socketId) {
      return { success: false, message: 'Only the host can start the game' };
    }

    if (room.players.length < 2) {
      return { success: false, message: 'Need at least 2 players to start' };
    }

    const engine = this.gameEngines.get(roomCode);
    if (!engine) {
      return { success: false, message: 'Game engine not found' };
    }

    engine.startGame();
    room.gameState = engine.getState();

    return { success: true };
  }

  proceedFromIntro(roomCode: string): { success: boolean } {
    const engine = this.gameEngines.get(roomCode);
    const room = this.rooms.get(roomCode);

    if (!engine || !room) {
      return { success: false };
    }

    engine.proceedFromIntro();
    room.gameState = engine.getState();

    return { success: true };
  }

  startVote(
    roomCode: string,
    prompt: string,
    options: string[],
    votingType: VotingState['votingType'],
    duration: number
  ): { success: boolean } {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false };
    }

    room.votingState = {
      active: true,
      prompt,
      options,
      votes: {},
      timeRemaining: duration,
      votingType
    };

    if (room.gameState) {
      room.gameState.gamePhase = 'voting';
    }

    return { success: true };
  }

  submitVote(
    roomCode: string,
    socketId: string,
    vote: string
  ): { success: boolean; message?: string } {
    const room = this.rooms.get(roomCode);

    if (!room || !room.votingState) {
      return { success: false, message: 'No active vote' };
    }

    const player = room.players.find(p => p.socketId === socketId);
    if (!player) {
      return { success: false, message: 'Player not found' };
    }

    if (!room.votingState.options.includes(vote)) {
      return { success: false, message: 'Invalid vote option' };
    }

    room.votingState.votes[player.id] = vote;

    return { success: true };
  }

  getVoteStatus(roomCode: string): { votesReceived: number; totalPlayers: number } {
    const room = this.rooms.get(roomCode);

    if (!room || !room.votingState) {
      return { votesReceived: 0, totalPlayers: 0 };
    }

    return {
      votesReceived: Object.keys(room.votingState.votes).length,
      totalPlayers: room.players.length
    };
  }

  resolveVote(roomCode: string): {
    success: boolean;
    winner?: string;
    allVotes?: Record<string, string>;
  } {
    const room = this.rooms.get(roomCode);

    if (!room || !room.votingState) {
      return { success: false };
    }

    // Clear timer if exists
    const timer = this.voteTimers.get(roomCode);
    if (timer) {
      clearInterval(timer);
      this.voteTimers.delete(roomCode);
    }

    // Count votes
    const voteCounts: Record<string, number> = {};
    for (const option of room.votingState.options) {
      voteCounts[option] = 0;
    }

    for (const vote of Object.values(room.votingState.votes)) {
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

    const winner = winners[Math.floor(Math.random() * winners.length)];

    // Store vote result and clear voting state
    const allVotes = { ...room.votingState.votes };
    room.votingState = null;

    // Update game phase
    if (room.gameState) {
      room.gameState.gamePhase = 'searching';
    }

    return { success: true, winner, allVotes };
  }

  setVoteTimer(roomCode: string, timer: NodeJS.Timeout): void {
    this.voteTimers.set(roomCode, timer);
  }

  searchLocation(
    roomCode: string,
    locationId: string
  ): { success: boolean; message?: string; clue?: CollectedClue | null } {
    const engine = this.gameEngines.get(roomCode);
    const room = this.rooms.get(roomCode);

    if (!engine || !room) {
      return { success: false, message: 'Game not found' };
    }

    const clue = engine.search(locationId);
    room.gameState = engine.getState();

    return { success: true, clue };
  }

  travel(
    roomCode: string,
    destination: string
  ): { success: boolean; message: string; timeSpent: number } {
    const engine = this.gameEngines.get(roomCode);
    const room = this.rooms.get(roomCode);

    if (!engine || !room) {
      return { success: false, message: 'Game not found', timeSpent: 0 };
    }

    const result = engine.travel(destination);
    room.gameState = engine.getState();

    return result;
  }

  submitToPilot(roomCode: string): {
    identified: boolean;
    message: string;
    possibleMatches?: string[];
  } {
    const engine = this.gameEngines.get(roomCode);
    const room = this.rooms.get(roomCode);

    if (!engine || !room) {
      return { identified: false, message: 'Game not found' };
    }

    const result = engine.submitToAI([]);
    room.gameState = engine.getState();

    return result;
  }

  getDestinationOptions(roomCode: string): string[] {
    const engine = this.gameEngines.get(roomCode);

    if (!engine) {
      return [];
    }

    return engine.getDestinationOptions();
  }

  getNewsHeadline(roomCode: string): string {
    const engine = this.gameEngines.get(roomCode);

    if (!engine) {
      return 'BREAKING: Technical difficulties at news desk';
    }

    return engine.getNewsHeadline();
  }

  getPublicGameState(roomCode: string): Partial<GameState> | null {
    const engine = this.gameEngines.get(roomCode);
    const room = this.rooms.get(roomCode);

    if (!engine || !room) {
      return null;
    }

    const state = engine.getState();
    const currentCompany = engine.getCurrentCompany();

    // Return a sanitized version without revealing the criminal identity
    return {
      currentCityIndex: state.currentCityIndex,
      hoursRemaining: state.hoursRemaining,
      cluesCollected: state.cluesCollected,
      criminalIdentified: state.criminalIdentified,
      criminalName: state.criminalIdentified ? state.criminal.name : null,
      fidelityMode: state.fidelityMode,
      customVillain: state.customVillain,
      gamePhase: state.gamePhase,
      // Current company info
      currentCompany: {
        name: currentCompany.name,
        city: currentCompany.city,
        state: currentCompany.state,
        industry: currentCompany.industry,
        stolenAsset: currentCompany.stolenAsset
      },
      // Locations available to search
      availableLocations: LOCATIONS_BY_INDUSTRY[currentCompany.industry],
      searchedLocations: engine.getSearchedLocationsThisCity(),
      // Total cities to visit
      totalCities: state.companies.length,
      // Victory/defeat messages
      victoryMessage: state.gamePhase === 'victory' ? engine.getVictoryMessage() : undefined,
      defeatMessage: state.gamePhase === 'defeat' ? engine.getDefeatMessage() : undefined,
      // Roberta quote for intro
      robertaQuote: state.gamePhase === 'intro' ? engine.getRobertaQuote() : undefined,
      // Criminal archetype description (only if identified)
      criminalDescription: state.criminalIdentified ? state.criminal.description : undefined
    } as Partial<GameState>;
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  getRoomCount(): number {
    return this.rooms.size;
  }

  handleDisconnect(socketId: string): string[] {
    const affectedRooms: string[] = [];

    for (const [roomCode, room] of this.rooms) {
      const playerIndex = room.players.findIndex(p => p.socketId === socketId);

      if (playerIndex !== -1) {
        affectedRooms.push(roomCode);

        // If host disconnects, close the room or transfer host
        if (room.hostSocketId === socketId) {
          if (room.players.length > 1) {
            // Transfer host to next player
            room.players.splice(playerIndex, 1);
            room.hostSocketId = room.players[0].socketId;
            room.players[0].isHost = true;
          } else {
            // Close the room
            this.rooms.delete(roomCode);
            this.gameEngines.delete(roomCode);
            const timer = this.voteTimers.get(roomCode);
            if (timer) {
              clearInterval(timer);
              this.voteTimers.delete(roomCode);
            }
          }
        } else {
          room.players.splice(playerIndex, 1);
        }
      }
    }

    return affectedRooms;
  }

  // Cleanup old rooms (call periodically)
  cleanupOldRooms(maxAgeMs: number = 3600000): void {
    const now = new Date();

    for (const [roomCode, room] of this.rooms) {
      const age = now.getTime() - room.createdAt.getTime();

      if (age > maxAgeMs) {
        this.rooms.delete(roomCode);
        this.gameEngines.delete(roomCode);
        const timer = this.voteTimers.get(roomCode);
        if (timer) {
          clearInterval(timer);
          this.voteTimers.delete(roomCode);
        }
        console.log(`Cleaned up old room: ${roomCode}`);
      }
    }
  }
}
