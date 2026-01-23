import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './RoomManager.js';

const app = express();
const httpServer = createServer(app);

// Configure CORS - allow all origins in production for easy deployment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true // Allow all origins in production (you can restrict this later)
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Room manager instance
const roomManager = new RoomManager();

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', rooms: roomManager.getRoomCount() });
});

// Socket.io connection handling
io.on('connection', (socket: Socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Create a new room (host)
  socket.on('create-room', (data: { hostName: string; fidelityMode?: boolean; customVillain?: any }) => {
    try {
      const room = roomManager.createRoom(socket.id, data.hostName, data.fidelityMode, data.customVillain);
      socket.join(room.roomCode);

      socket.emit('room-created', {
        roomCode: room.roomCode,
        players: room.players
      });

      console.log(`Room ${room.roomCode} created by ${data.hostName}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create room' });
    }
  });

  // Join an existing room (player)
  socket.on('join-room', (data: { roomCode: string; playerName: string }) => {
    try {
      const result = roomManager.joinRoom(data.roomCode.toUpperCase(), socket.id, data.playerName);

      if (!result.success) {
        socket.emit('error', { message: result.message });
        return;
      }

      socket.join(data.roomCode.toUpperCase());

      // Notify the joining player
      socket.emit('room-joined', {
        roomCode: data.roomCode.toUpperCase(),
        players: result.room!.players,
        isHost: false
      });

      // Notify all players in the room
      io.to(data.roomCode.toUpperCase()).emit('player-joined', {
        players: result.room!.players
      });

      console.log(`${data.playerName} joined room ${data.roomCode}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Start the game (host only)
  socket.on('start-game', (data: { roomCode: string }) => {
    try {
      const result = roomManager.startGame(data.roomCode, socket.id);

      if (!result.success) {
        socket.emit('error', { message: result.message });
        return;
      }

      io.to(data.roomCode).emit('game-started', {
        gameState: roomManager.getPublicGameState(data.roomCode)
      });

      console.log(`Game started in room ${data.roomCode}`);
    } catch (error) {
      socket.emit('error', { message: 'Failed to start game' });
    }
  });

  // Proceed from intro
  socket.on('proceed-from-intro', (data: { roomCode: string }) => {
    const result = roomManager.proceedFromIntro(data.roomCode);
    if (result.success) {
      io.to(data.roomCode).emit('game-update', {
        gameState: roomManager.getPublicGameState(data.roomCode)
      });
    }
  });

  // Start a vote
  socket.on('start-vote', (data: {
    roomCode: string;
    prompt: string;
    options: string[];
    votingType: 'travel' | 'search' | 'continue' | 'pilot';
    duration?: number;
  }) => {
    const result = roomManager.startVote(
      data.roomCode,
      data.prompt,
      data.options,
      data.votingType,
      data.duration || 20
    );

    if (result.success) {
      io.to(data.roomCode).emit('vote-started', {
        prompt: data.prompt,
        options: data.options,
        votingType: data.votingType,
        duration: data.duration || 20
      });

      // Start vote timer
      startVoteTimer(data.roomCode, data.duration || 20);
    }
  });

  // Submit a vote
  socket.on('submit-vote', (data: { roomCode: string; vote: string }) => {
    const result = roomManager.submitVote(data.roomCode, socket.id, data.vote);

    if (result.success) {
      // Broadcast vote update (without revealing who voted what)
      const voteStatus = roomManager.getVoteStatus(data.roomCode);
      io.to(data.roomCode).emit('vote-update', {
        votesReceived: voteStatus.votesReceived,
        totalPlayers: voteStatus.totalPlayers
      });

      // Check if all votes are in
      if (voteStatus.votesReceived === voteStatus.totalPlayers) {
        resolveVote(data.roomCode);
      }
    }
  });

  // Search a location
  socket.on('search-location', (data: { roomCode: string; locationId: string }) => {
    const result = roomManager.searchLocation(data.roomCode, data.locationId);

    if (result.success) {
      io.to(data.roomCode).emit('search-result', {
        clue: result.clue,
        gameState: roomManager.getPublicGameState(data.roomCode)
      });
    } else {
      socket.emit('error', { message: result.message });
    }
  });

  // Travel to destination
  socket.on('travel', (data: { roomCode: string; destination: string }) => {
    const result = roomManager.travel(data.roomCode, data.destination);

    io.to(data.roomCode).emit('travel-result', {
      success: result.success,
      message: result.message,
      timeSpent: result.timeSpent,
      gameState: roomManager.getPublicGameState(data.roomCode)
    });
  });

  // Submit to AI (Pilot)
  socket.on('submit-to-pilot', (data: { roomCode: string }) => {
    const result = roomManager.submitToPilot(data.roomCode);

    io.to(data.roomCode).emit('pilot-result', {
      identified: result.identified,
      message: result.message,
      possibleMatches: result.possibleMatches,
      gameState: roomManager.getPublicGameState(data.roomCode)
    });
  });

  // Get game state
  socket.on('get-state', (data: { roomCode: string }) => {
    const gameState = roomManager.getPublicGameState(data.roomCode);
    socket.emit('game-state', { gameState });
  });

  // Get destination options
  socket.on('get-destinations', (data: { roomCode: string }) => {
    const options = roomManager.getDestinationOptions(data.roomCode);
    socket.emit('destination-options', { options });
  });

  // Get news headline
  socket.on('get-news', (data: { roomCode: string }) => {
    const headline = roomManager.getNewsHeadline(data.roomCode);
    socket.emit('news-headline', { headline });
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Find and update any rooms this socket was in
    const affectedRooms = roomManager.handleDisconnect(socket.id);

    for (const roomCode of affectedRooms) {
      const room = roomManager.getRoom(roomCode);
      if (room) {
        io.to(roomCode).emit('player-left', {
          players: room.players
        });
      }
    }
  });
});

// Vote timer function
function startVoteTimer(roomCode: string, duration: number) {
  let timeRemaining = duration;

  const interval = setInterval(() => {
    timeRemaining--;

    io.to(roomCode).emit('vote-timer', { timeRemaining });

    if (timeRemaining <= 0) {
      clearInterval(interval);
      resolveVote(roomCode);
    }
  }, 1000);

  // Store interval reference in room for potential early resolution
  roomManager.setVoteTimer(roomCode, interval);
}

// Resolve vote function
function resolveVote(roomCode: string) {
  const result = roomManager.resolveVote(roomCode);

  if (result.success) {
    io.to(roomCode).emit('vote-result', {
      winner: result.winner,
      allVotes: result.allVotes,
      gameState: roomManager.getPublicGameState(roomCode)
    });
  }
}

// Start server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   All hands on deck - Game Server                        ║
  ║   Server running on port ${PORT}                            ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});

export { io };
