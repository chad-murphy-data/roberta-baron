import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react'
import PartySocket from 'partysocket'

// Message types matching the server
export type ServerMessage =
  | { type: 'room-joined'; roomCode: string; players: Player[]; isHost: boolean }
  | { type: 'player-joined'; players: Player[] }
  | { type: 'player-left'; players: Player[] }
  | { type: 'game-started'; gameState: Partial<GameState> }
  | { type: 'game-update'; gameState: Partial<GameState> }
  | { type: 'vote-started'; prompt: string; options: string[]; votingType: VotingState['votingType']; duration: number }
  | { type: 'vote-timer'; timeRemaining: number }
  | { type: 'vote-update'; votesReceived: number; totalPlayers: number }
  | { type: 'vote-result'; winner: string; allVotes: Record<string, string>; gameState: Partial<GameState>; wasTiebreaker?: boolean }
  | { type: 'search-result'; clue: CollectedClue | null; gameState: Partial<GameState> }
  | { type: 'travel-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState> }
  | { type: 'pilot-result'; identified: boolean; message: string; possibleMatches?: string[]; gameState: Partial<GameState> }
  | { type: 'game-state'; gameState: Partial<GameState> | null }
  | { type: 'destination-options'; options: string[] }
  | { type: 'news-headline'; headline: string }
  | { type: 'error'; message: string }

export interface Player {
  id: string
  name: string
  connectionId: string
  isHost?: boolean
}

export interface CollectedClue {
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

export interface GameState {
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
  destinationOptions?: string[] // Pre-set travel options (always 4)
  victoryMessage?: string
  defeatMessage?: string
  robertaQuote?: string
  criminalDescription?: string
}

export interface VotingState {
  prompt: string
  options: string[]
  votingType: 'travel' | 'search' | 'continue' | 'pilot'
  duration: number
  timeRemaining: number
  votes: Record<string, string>
  winner?: string
  wasTiebreaker?: boolean
}

interface PartyKitContextType {
  socket: PartySocket | null
  isConnected: boolean
  roomCode: string | null
  players: Player[]
  isHost: boolean
  gameState: GameState | null
  votingState: VotingState | null
  error: string | null
  createRoom: (hostName: string, fidelityMode?: boolean) => void
  joinRoom: (roomCode: string, playerName: string) => void
  startGame: () => void
  proceedFromIntro: () => void
  submitVote: (vote: string) => void
  searchLocation: (locationId: string) => void
  travel: (destination: string) => void
  submitToPilot: () => void
  startVote: (prompt: string, options: string[], votingType: VotingState['votingType']) => void
  clearError: () => void
}

const PartyKitContext = createContext<PartyKitContextType | null>(null)

// Get PartyKit host from environment or use the deployed PartyKit server
const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || 'all-hands-on-deck.chad-murphy-data.partykit.dev'

// Generate a random 4-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function PartyKitProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<PartySocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isHost, setIsHost] = useState(false)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [votingState, setVotingState] = useState<VotingState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<PartySocket | null>(null)

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  const connectToRoom = useCallback((code: string, params: Record<string, string>, onConnect?: () => void) => {
    // Close existing socket if any
    if (socketRef.current) {
      socketRef.current.close()
    }

    const queryString = new URLSearchParams(params).toString()
    const newSocket = new PartySocket({
      host: PARTYKIT_HOST,
      room: code.toUpperCase(),
      query: queryString ? Object.fromEntries(new URLSearchParams(queryString)) : undefined
    })

    newSocket.addEventListener('open', () => {
      console.log('Connected to PartyKit room:', code)
      setIsConnected(true)
      // Call the onConnect callback if provided (used for joining rooms)
      if (onConnect) {
        onConnect()
      }
    })

    newSocket.addEventListener('close', () => {
      console.log('Disconnected from PartyKit')
      setIsConnected(false)
    })

    newSocket.addEventListener('error', (err) => {
      console.error('PartyKit connection error:', err)
      setError('Connection error')
    })

    newSocket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data) as ServerMessage
        handleMessage(message)
      } catch (err) {
        console.error('Error parsing message:', err)
      }
    })

    socketRef.current = newSocket
    setSocket(newSocket)
  }, [])

  const handleMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case 'room-joined':
        setRoomCode(message.roomCode)
        setPlayers(message.players)
        setIsHost(message.isHost)
        break

      case 'player-joined':
        setPlayers(message.players)
        break

      case 'player-left':
        setPlayers(message.players)
        break

      case 'game-started':
        setGameState(message.gameState as GameState)
        break

      case 'game-update':
        setGameState(message.gameState as GameState)
        break

      case 'vote-started':
        setVotingState({
          prompt: message.prompt,
          options: message.options,
          votingType: message.votingType,
          duration: message.duration,
          timeRemaining: message.duration,
          votes: {}
        })
        break

      case 'vote-timer':
        setVotingState(prev => prev ? { ...prev, timeRemaining: message.timeRemaining } : null)
        break

      case 'vote-update':
        // Could show vote progress
        break

      case 'vote-result':
        setVotingState(prev => prev ? { ...prev, winner: message.winner, votes: message.allVotes, wasTiebreaker: message.wasTiebreaker } : null)
        setGameState(message.gameState as GameState)
        // Clear voting state after showing results (longer if tiebreaker for dramatic effect)
        setTimeout(() => setVotingState(null), message.wasTiebreaker ? 3500 : 2000)
        break

      case 'search-result':
        setGameState(message.gameState as GameState)
        break

      case 'travel-result':
        setGameState(message.gameState as GameState)
        break

      case 'pilot-result':
        setGameState(message.gameState as GameState)
        break

      case 'game-state':
        if (message.gameState) {
          setGameState(message.gameState as GameState)
        }
        break

      case 'error':
        setError(message.message)
        break
    }
  }, [])

  const send = useCallback((data: object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data))
    }
  }, [])

  const createRoom = useCallback((hostName: string, fidelityMode = false) => {
    const code = generateRoomCode()
    connectToRoom(code, {
      host: 'true',
      hostName,
      fidelityMode: fidelityMode.toString()
    })
  }, [connectToRoom])

  const joinRoom = useCallback((code: string, playerName: string) => {
    // Connect to room and send join message once connected
    connectToRoom(code, {}, () => {
      // This callback runs after the socket is open
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'join-room', playerName }))
      }
    })
  }, [connectToRoom])

  const startGame = useCallback(() => {
    send({ type: 'start-game' })
  }, [send])

  const proceedFromIntro = useCallback(() => {
    send({ type: 'proceed-from-intro' })
  }, [send])

  const submitVote = useCallback((vote: string) => {
    send({ type: 'submit-vote', vote })
  }, [send])

  const searchLocation = useCallback((locationId: string) => {
    send({ type: 'search-location', locationId })
  }, [send])

  const travel = useCallback((destination: string) => {
    send({ type: 'travel', destination })
  }, [send])

  const submitToPilot = useCallback(() => {
    send({ type: 'submit-to-pilot' })
  }, [send])

  const startVote = useCallback((prompt: string, options: string[], votingType: VotingState['votingType']) => {
    send({ type: 'start-vote', prompt, options, votingType, duration: 20 })
  }, [send])

  const clearError = useCallback(() => setError(null), [])

  return (
    <PartyKitContext.Provider value={{
      socket,
      isConnected,
      roomCode,
      players,
      isHost,
      gameState,
      votingState,
      error,
      createRoom,
      joinRoom,
      startGame,
      proceedFromIntro,
      submitVote,
      searchLocation,
      travel,
      submitToPilot,
      startVote,
      clearError
    }}>
      {children}
    </PartyKitContext.Provider>
  )
}

export function usePartyKit() {
  const context = useContext(PartyKitContext)
  if (!context) {
    throw new Error('usePartyKit must be used within a PartyKitProvider')
  }
  return context
}

// Re-export for backwards compatibility
export { usePartyKit as useGame }
