import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import { useSocket } from './SocketContext'

// Types matching server types
interface Player {
  id: string
  name: string
  socketId: string
  isHost?: boolean
}

interface CollectedClue {
  type: 'criminal' | 'destination'
  text: string
  cityFound: string
}

interface SearchLocation {
  id: string
  name: string
  description: string
}

interface CurrentCompany {
  name: string
  city: string
  state: string
  industry: string
  stolenAsset: string
}

interface GameState {
  currentCityIndex: number
  hoursRemaining: number
  cluesCollected: CollectedClue[]
  criminalIdentified: boolean
  criminalName: string | null
  fidelityMode: boolean
  gamePhase: 'lobby' | 'intro' | 'searching' | 'voting' | 'traveling' | 'pilot' | 'victory' | 'defeat'
  currentCompany: CurrentCompany
  availableLocations: SearchLocation[]
  searchedLocations: string[]
  totalCities: number
  victoryMessage?: string
  defeatMessage?: string
  robertaQuote?: string
  criminalDescription?: string
}

interface VotingState {
  prompt: string
  options: string[]
  votingType: 'travel' | 'search' | 'continue' | 'pilot'
  duration: number
  timeRemaining: number
  votes: Record<string, string>
  winner?: string
}

interface GameContextType {
  roomCode: string | null
  players: Player[]
  isHost: boolean
  gameState: GameState | null
  votingState: VotingState | null
  createRoom: (hostName: string, fidelityMode?: boolean) => void
  joinRoom: (roomCode: string, playerName: string) => void
  startGame: () => void
  proceedFromIntro: () => void
  submitVote: (vote: string) => void
  searchLocation: (locationId: string) => void
  travel: (destination: string) => void
  submitToPilot: () => void
  startVote: (prompt: string, options: string[], votingType: VotingState['votingType']) => void
  error: string | null
  clearError: () => void
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const { socket } = useSocket()
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isHost, setIsHost] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [votingState, setVotingState] = useState<VotingState | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Set up socket listeners
  useCallback(() => {
    if (!socket) return

    socket.on('room-created', (data: { roomCode: string; players: Player[] }) => {
      setRoomCode(data.roomCode)
      setPlayers(data.players)
      setIsHost(true)
    })

    socket.on('room-joined', (data: { roomCode: string; players: Player[] }) => {
      setRoomCode(data.roomCode)
      setPlayers(data.players)
    })

    socket.on('player-joined', (data: { players: Player[] }) => {
      setPlayers(data.players)
    })

    socket.on('player-left', (data: { players: Player[] }) => {
      setPlayers(data.players)
    })

    socket.on('game-started', (data: { gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('game-update', (data: { gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('vote-started', (data: {
      prompt: string
      options: string[]
      votingType: VotingState['votingType']
      duration: number
    }) => {
      setVotingState({
        prompt: data.prompt,
        options: data.options,
        votingType: data.votingType,
        duration: data.duration,
        timeRemaining: data.duration,
        votes: {}
      })
    })

    socket.on('vote-timer', (data: { timeRemaining: number }) => {
      setVotingState(prev => prev ? { ...prev, timeRemaining: data.timeRemaining } : null)
    })

    socket.on('vote-update', (data: { votesReceived: number; totalPlayers: number }) => {
      // Could show vote progress
    })

    socket.on('vote-result', (data: { winner: string; allVotes: Record<string, string>; gameState: GameState }) => {
      setVotingState(prev => prev ? { ...prev, winner: data.winner, votes: data.allVotes } : null)
      setGameState(data.gameState)
      // Clear voting state after showing results
      setTimeout(() => setVotingState(null), 2000)
    })

    socket.on('search-result', (data: { clue: CollectedClue | null; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('travel-result', (data: { success: boolean; message: string; timeSpent: number; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('pilot-result', (data: { identified: boolean; message: string; possibleMatches?: string[]; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('error', (data: { message: string }) => {
      setError(data.message)
    })

    return () => {
      socket.off('room-created')
      socket.off('room-joined')
      socket.off('player-joined')
      socket.off('player-left')
      socket.off('game-started')
      socket.off('game-update')
      socket.off('vote-started')
      socket.off('vote-timer')
      socket.off('vote-update')
      socket.off('vote-result')
      socket.off('search-result')
      socket.off('travel-result')
      socket.off('pilot-result')
      socket.off('error')
    }
  }, [socket])

  // Set up listeners when socket changes
  if (socket) {
    socket.off('room-created')
    socket.off('room-joined')
    socket.off('player-joined')
    socket.off('player-left')
    socket.off('game-started')
    socket.off('game-update')
    socket.off('vote-started')
    socket.off('vote-timer')
    socket.off('vote-update')
    socket.off('vote-result')
    socket.off('search-result')
    socket.off('travel-result')
    socket.off('pilot-result')
    socket.off('error')

    socket.on('room-created', (data: { roomCode: string; players: Player[] }) => {
      setRoomCode(data.roomCode)
      setPlayers(data.players)
      setIsHost(true)
    })

    socket.on('room-joined', (data: { roomCode: string; players: Player[] }) => {
      setRoomCode(data.roomCode)
      setPlayers(data.players)
    })

    socket.on('player-joined', (data: { players: Player[] }) => {
      setPlayers(data.players)
    })

    socket.on('player-left', (data: { players: Player[] }) => {
      setPlayers(data.players)
    })

    socket.on('game-started', (data: { gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('game-update', (data: { gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('vote-started', (data: {
      prompt: string
      options: string[]
      votingType: VotingState['votingType']
      duration: number
    }) => {
      setVotingState({
        prompt: data.prompt,
        options: data.options,
        votingType: data.votingType,
        duration: data.duration,
        timeRemaining: data.duration,
        votes: {}
      })
    })

    socket.on('vote-timer', (data: { timeRemaining: number }) => {
      setVotingState(prev => prev ? { ...prev, timeRemaining: data.timeRemaining } : null)
    })

    socket.on('vote-result', (data: { winner: string; allVotes: Record<string, string>; gameState: GameState }) => {
      setVotingState(prev => prev ? { ...prev, winner: data.winner, votes: data.allVotes } : null)
      setGameState(data.gameState)
      setTimeout(() => setVotingState(null), 2000)
    })

    socket.on('search-result', (data: { clue: CollectedClue | null; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('travel-result', (data: { success: boolean; message: string; timeSpent: number; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('pilot-result', (data: { identified: boolean; message: string; possibleMatches?: string[]; gameState: GameState }) => {
      setGameState(data.gameState)
    })

    socket.on('error', (data: { message: string }) => {
      setError(data.message)
    })
  }

  const createRoom = (hostName: string, fidelityMode = false) => {
    if (socket) {
      socket.emit('create-room', { hostName, fidelityMode })
    }
  }

  const joinRoom = (code: string, playerName: string) => {
    if (socket) {
      socket.emit('join-room', { roomCode: code.toUpperCase(), playerName })
    }
  }

  const startGame = () => {
    if (socket && roomCode) {
      socket.emit('start-game', { roomCode })
    }
  }

  const proceedFromIntro = () => {
    if (socket && roomCode) {
      socket.emit('proceed-from-intro', { roomCode })
    }
  }

  const submitVote = (vote: string) => {
    if (socket && roomCode) {
      socket.emit('submit-vote', { roomCode, vote })
    }
  }

  const searchLocation = (locationId: string) => {
    if (socket && roomCode) {
      socket.emit('search-location', { roomCode, locationId })
    }
  }

  const travel = (destination: string) => {
    if (socket && roomCode) {
      socket.emit('travel', { roomCode, destination })
    }
  }

  const submitToPilot = () => {
    if (socket && roomCode) {
      socket.emit('submit-to-pilot', { roomCode })
    }
  }

  const startVote = (prompt: string, options: string[], votingType: VotingState['votingType']) => {
    if (socket && roomCode) {
      socket.emit('start-vote', { roomCode, prompt, options, votingType, duration: 20 })
    }
  }

  const clearError = () => setError(null)

  return (
    <GameContext.Provider value={{
      roomCode,
      players,
      isHost,
      gameState,
      votingState,
      createRoom,
      joinRoom,
      startGame,
      proceedFromIntro,
      submitVote,
      searchLocation,
      travel,
      submitToPilot,
      startVote,
      error,
      clearError
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
