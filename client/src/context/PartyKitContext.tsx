import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useRef } from 'react'
import PartySocket from 'partysocket'
import { sounds } from '../utils/sounds'

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
  | { type: 'vote-result'; winner: string; allVotes: Record<string, string>; gameState: Partial<GameState>; wasTiebreaker?: boolean; tiebreakerPlayerName?: string }
  | { type: 'search-result'; clue: CollectedClue | null; gameState: Partial<GameState> }
  | { type: 'travel-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState>; wrongCity?: boolean }
  | { type: 'fly-back-result'; success: boolean; message: string; timeSpent: number; gameState: Partial<GameState> }
  | { type: 'pilot-result'; identified: boolean; message: string; possibleMatches?: string[]; gameState: Partial<GameState> }
  | { type: 'game-state'; gameState: Partial<GameState> | null }
  | { type: 'destination-options'; options: string[] }
  | { type: 'news-headline'; headline: string }
  | { type: 'error'; message: string }
  // Asymmetric clue distribution messages
  | { type: 'private-clue'; clue: CollectedClue; clueId: string }
  | { type: 'no-clue-for-you'; message: string }
  | { type: 'clues-discovered'; count: number; unsharedCount: number; searcherName?: string; message: string }
  | { type: 'clue-shared'; clue: CollectedClue; sharedBy: string; gameState: Partial<GameState>; unsharedCount: number }
  // Mind Meld messages
  | { type: 'mind-meld-start'; prompt: string; timeLimit: number }
  | { type: 'mind-meld-player-ready'; playerId: string; playerName: string; readyCount: number; totalPlayers: number }
  | { type: 'mind-meld-timer'; timeRemaining: number }
  | { type: 'mind-meld-reveal'; matches: MindMeldMatch[]; totalPoints: number; timeBonus: number }
  | { type: 'mind-meld-reveal-next'; matchIndex: number; match: MindMeldMatch }
  | { type: 'mind-meld-complete'; newHoursRemaining: number; gameState: Partial<GameState> }
  // Popularity messages
  | { type: 'popularity-start'; matchup: PopularityMatchup; timeLimit: number }
  | { type: 'popularity-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'popularity-timer'; timeRemaining: number }
  | { type: 'popularity-reveal'; matchup: PopularityMatchupWithWinner; results: PopularityResults; gameState: Partial<GameState> }
  | { type: 'popularity-complete'; newHoursRemaining: number; gameState: Partial<GameState> }
  // High-Low messages
  | { type: 'high-low-start'; currentCard: Card; streak: number; timeBanked: number; timeLimit: number }
  | { type: 'high-low-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'high-low-timer'; timeRemaining: number }
  | { type: 'high-low-reveal'; currentCard: Card; nextCard: Card; result: 'correct' | 'wrong' | 'push'; teamChoice: 'higher' | 'lower'; newStreak: number; timeBanked: number; canContinue: boolean }
  | { type: 'high-low-continue-vote-start'; timeLimit: number }
  | { type: 'high-low-continue-player-voted'; playerId: string; playerName: string; votedCount: number; totalPlayers: number }
  | { type: 'high-low-complete'; finalStreak: number; timeBonus: number; reason: 'wrong' | 'cashed_out'; newHoursRemaining: number; gameState: Partial<GameState> }

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
  sharedBy?: string
}

// Private clue that hasn't been shared yet
export interface PrivateClue {
  clue: CollectedClue
  clueId: string
  shared: boolean
}

// Clue discovery state for the host/all players
export interface ClueDiscoveryState {
  count: number
  unsharedCount: number
  searcherName?: string  // Who found the clues
  message: string
}

// Mind Meld types
export interface MindMeldMatch {
  answer: string
  playerIds: string[]
  playerNames: string[]
  matchSize: number
  points: number
}

export interface MindMeldState {
  active: boolean
  phase: 'input' | 'waiting' | 'revealing' | 'complete'
  prompt: string
  timeLimit: number
  timeRemaining: number
  submissions: { playerId: string; playerName: string }[]
  readyCount: number
  totalPlayers: number
  results?: {
    matches: MindMeldMatch[]
    totalPoints: number
    timeBonus: number
  }
  revealIndex?: number
  currentMatch?: MindMeldMatch
}

// Popularity types
export interface PopularityMatchup {
  id: string
  category: string
  optionA: { name: string; value?: number; formattedValue?: string }
  optionB: { name: string; value?: number; formattedValue?: string }
}

export interface PopularityMatchupWithWinner extends PopularityMatchup {
  winner: 'A' | 'B'
}

export interface PopularityResults {
  correctPlayers: string[]
  incorrectPlayers: string[]
  teamScore: number
  timeBonus: number
}

export interface PopularityState {
  active: boolean
  phase: 'voting' | 'reveal' | 'complete'
  matchup: PopularityMatchup | PopularityMatchupWithWinner
  votes: { playerId: string; playerName: string; choice: 'A' | 'B' }[]
  timeLimit: number
  timeRemaining: number
  results?: PopularityResults
}

// High-Low types
export interface Card {
  rank: number
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  display: string
}

export interface HighLowState {
  active: boolean
  phase: 'voting' | 'reveal' | 'continue_vote' | 'complete'
  currentCard: Card
  nextCard?: Card
  streak: number
  timeBanked: number
  votes: { playerId: string; playerName: string; choice: 'higher' | 'lower' }[]
  continueVotes: { playerId: string; playerName: string; choice: 'continue' | 'cash_out' }[]
  timeLimit: number
  timeRemaining: number
  lastResult?: 'correct' | 'wrong' | 'push'
  teamChoice?: 'higher' | 'lower'
  results?: {
    finalStreak: number
    timeBonus: number
    reason: 'wrong' | 'cashed_out'
  }
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

export interface DestinationOption {
  name: string
  city: string
  state: string
}

export interface GameState {
  currentCityIndex: number
  hoursRemaining: number
  cluesCollected: CollectedClue[]
  currentCityClues?: CollectedClue[] // Filtered clues for current city display
  criminalIdentified: boolean
  criminalName: string | null
  fidelityMode: boolean
  gamePhase: 'lobby' | 'intro' | 'searching' | 'voting' | 'traveling' | 'miniGame' | 'pilot' | 'victory' | 'defeat' | 'wrongCity'
  activeMiniGame?: 'mind_meld' | 'popularity' | 'high_low'
  mindMeld?: MindMeldState
  popularity?: PopularityState
  highLow?: HighLowState
  currentCompany: CurrentCompany
  availableLocations: SearchLocation[]
  searchedLocations: string[]
  totalCities: number
  destinationOptions?: string[] // Pre-set travel options (always 4)
  destinationOptionsWithCities?: DestinationOption[] // Travel options with city info
  wrongCityName?: string // Name of wrong city if player traveled to wrong destination
  deadEndMessage?: string // Message to show when in wrong city
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
  tiebreakerPlayerName?: string
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
  // Asymmetric clue distribution state
  privateClues: PrivateClue[]
  clueDiscovery: ClueDiscoveryState | null
  noClueMessage: string | null
  // Mini-game states
  mindMeldState: MindMeldState | null
  popularityState: PopularityState | null
  highLowState: HighLowState | null
  createRoom: (hostName: string, fidelityMode?: boolean) => void
  joinRoom: (roomCode: string, playerName: string) => void
  startGame: () => void
  proceedFromIntro: () => void
  submitVote: (vote: string) => void
  searchLocation: (locationId: string) => void
  travel: (destination: string) => void
  flyBack: () => void
  submitToPilot: () => void
  startVote: (prompt: string, options: string[], votingType: VotingState['votingType']) => void
  clearError: () => void
  shareClue: (clueId: string) => void
  submitMindMeld: (answers: string[]) => void
  submitPopularityVote: (choice: 'A' | 'B') => void
  submitHighLowVote: (choice: 'higher' | 'lower') => void
  submitHighLowContinue: (choice: 'continue' | 'cash_out') => void
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
  // Asymmetric clue distribution state
  const [privateClues, setPrivateClues] = useState<PrivateClue[]>([])
  const [clueDiscovery, setClueDiscovery] = useState<ClueDiscoveryState | null>(null)
  const [noClueMessage, setNoClueMessage] = useState<string | null>(null)
  // Mini-game states
  const [mindMeldState, setMindMeldState] = useState<MindMeldState | null>(null)
  const [popularityState, setPopularityState] = useState<PopularityState | null>(null)
  const [highLowState, setHighLowState] = useState<HighLowState | null>(null)

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
        setVotingState(prev => prev ? { ...prev, winner: message.winner, votes: message.allVotes, wasTiebreaker: message.wasTiebreaker, tiebreakerPlayerName: message.tiebreakerPlayerName } : null)
        setGameState(message.gameState as GameState)
        // Clear voting state after showing results (longer if tiebreaker for dramatic effect)
        setTimeout(() => setVotingState(null), message.wasTiebreaker ? 3500 : 2000)
        break

      case 'search-result':
        setGameState(message.gameState as GameState)
        break

      case 'travel-result':
        setGameState(message.gameState as GameState)
        // Clear private clues and discovery state when traveling to new city
        setPrivateClues([])
        setClueDiscovery(null)
        setNoClueMessage(null)
        // Play travel sounds
        if (message.success) {
          sounds.play('correct-city')
        } else if (message.wrongCity) {
          sounds.play('wrong-city')
        }
        break

      case 'fly-back-result':
        setGameState(message.gameState as GameState)
        sounds.play('flight-landing')
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

      // Asymmetric clue distribution handlers
      case 'private-clue':
        // Add to our private clues list
        setPrivateClues(prev => [...prev, {
          clue: message.clue,
          clueId: message.clueId,
          shared: false
        }])
        // Clear the "no clue" message if it was showing
        setNoClueMessage(null)
        // Play clue discovered sound
        sounds.play('clue-discovered')
        break

      case 'no-clue-for-you':
        setNoClueMessage(message.message)
        break

      case 'clues-discovered':
        setClueDiscovery({
          count: message.count,
          unsharedCount: message.unsharedCount,
          searcherName: message.searcherName,
          message: message.message
        })
        break

      case 'clue-shared':
        // Update game state with the newly shared clue
        setGameState(message.gameState as GameState)
        // Update clue discovery count
        setClueDiscovery(prev => prev ? {
          ...prev,
          unsharedCount: message.unsharedCount
        } : null)
        // Mark our own clue as shared if it matches
        setPrivateClues(prev => prev.map(pc =>
          pc.clue.text === message.clue.text ? { ...pc, shared: true } : pc
        ))
        // Play clue shared sound
        sounds.play('clue-shared')
        break

      // Mind Meld handlers
      case 'mind-meld-start':
        setMindMeldState({
          active: true,
          phase: 'input',
          prompt: message.prompt,
          timeLimit: message.timeLimit,
          timeRemaining: message.timeLimit,
          submissions: [],
          readyCount: 0,
          totalPlayers: 0
        })
        sounds.play('mind-meld-start')
        break

      case 'mind-meld-player-ready':
        setMindMeldState(prev => prev ? {
          ...prev,
          submissions: [...prev.submissions, { playerId: message.playerId, playerName: message.playerName }],
          readyCount: message.readyCount,
          totalPlayers: message.totalPlayers
        } : null)
        sounds.play('mind-meld-submit')
        break

      case 'mind-meld-timer':
        setMindMeldState(prev => prev ? {
          ...prev,
          timeRemaining: message.timeRemaining
        } : null)
        break

      case 'mind-meld-reveal':
        setMindMeldState(prev => prev ? {
          ...prev,
          phase: 'revealing',
          results: {
            matches: message.matches,
            totalPoints: message.totalPoints,
            timeBonus: message.timeBonus
          },
          revealIndex: -1  // Start before first match
        } : null)
        // Play no-match sound if zero matches
        if (message.matches.length === 0) {
          sounds.play('mind-meld-no-match')
        }
        break

      case 'mind-meld-reveal-next':
        setMindMeldState(prev => prev ? {
          ...prev,
          revealIndex: message.matchIndex,
          currentMatch: message.match
        } : null)
        // Play match sound based on size
        if (message.match.matchSize >= 3) {
          sounds.play('mind-meld-big-match')
        } else {
          sounds.play('mind-meld-match')
        }
        break

      case 'mind-meld-complete':
        setMindMeldState(prev => prev ? {
          ...prev,
          phase: 'complete',
          active: false
        } : null)
        setGameState(message.gameState as GameState)
        // Play bonus sound
        sounds.play('mind-meld-bonus')
        // Clear mind meld state after a delay
        setTimeout(() => setMindMeldState(null), 3000)
        break

      // Popularity handlers
      case 'popularity-start':
        setPopularityState({
          active: true,
          phase: 'voting',
          matchup: message.matchup,
          votes: [],
          timeLimit: message.timeLimit,
          timeRemaining: message.timeLimit
        })
        sounds.play('mind-meld-start') // Reuse the game start sound
        break

      case 'popularity-player-voted':
        setPopularityState(prev => prev ? {
          ...prev,
          votes: [...prev.votes, { playerId: message.playerId, playerName: message.playerName, choice: 'A' }] // Choice not exposed, just track who voted
        } : null)
        break

      case 'popularity-timer':
        setPopularityState(prev => prev ? {
          ...prev,
          timeRemaining: message.timeRemaining
        } : null)
        break

      case 'popularity-reveal':
        setPopularityState(prev => prev ? {
          ...prev,
          phase: 'reveal',
          matchup: message.matchup,
          results: message.results
        } : null)
        setGameState(message.gameState as GameState)
        // Play result sound
        if (message.results.teamScore > message.results.correctPlayers.length + message.results.incorrectPlayers.length / 2) {
          sounds.play('mind-meld-match')
        }
        break

      case 'popularity-complete':
        setPopularityState(prev => prev ? {
          ...prev,
          phase: 'complete',
          active: false
        } : null)
        setGameState(message.gameState as GameState)
        sounds.play('mind-meld-bonus')
        setTimeout(() => setPopularityState(null), 3000)
        break

      // High-Low handlers
      case 'high-low-start':
        setHighLowState({
          active: true,
          phase: 'voting',
          currentCard: message.currentCard,
          streak: message.streak,
          timeBanked: message.timeBanked,
          votes: [],
          continueVotes: [],
          timeLimit: message.timeLimit,
          timeRemaining: message.timeLimit
        })
        sounds.play('mind-meld-start')
        break

      case 'high-low-player-voted':
        setHighLowState(prev => prev ? {
          ...prev,
          votes: [...prev.votes, { playerId: message.playerId, playerName: message.playerName, choice: 'higher' }] // Choice not exposed
        } : null)
        break

      case 'high-low-timer':
        setHighLowState(prev => prev ? {
          ...prev,
          timeRemaining: message.timeRemaining
        } : null)
        break

      case 'high-low-reveal':
        setHighLowState(prev => prev ? {
          ...prev,
          phase: 'reveal',
          nextCard: message.nextCard,
          lastResult: message.result,
          teamChoice: message.teamChoice,
          streak: message.newStreak,
          timeBanked: message.timeBanked
        } : null)
        // Play appropriate sound
        if (message.result === 'correct') {
          sounds.play('mind-meld-match')
        } else if (message.result === 'wrong') {
          sounds.play('mind-meld-no-match')
        }
        break

      case 'high-low-continue-vote-start':
        setHighLowState(prev => prev ? {
          ...prev,
          phase: 'continue_vote',
          continueVotes: [],
          timeRemaining: message.timeLimit
        } : null)
        break

      case 'high-low-continue-player-voted':
        setHighLowState(prev => prev ? {
          ...prev,
          continueVotes: [...prev.continueVotes, { playerId: message.playerId, playerName: message.playerName, choice: 'continue' }]
        } : null)
        break

      case 'high-low-complete':
        setHighLowState(prev => prev ? {
          ...prev,
          phase: 'complete',
          active: false,
          results: {
            finalStreak: message.finalStreak,
            timeBonus: message.timeBonus,
            reason: message.reason
          }
        } : null)
        setGameState(message.gameState as GameState)
        sounds.play('mind-meld-bonus')
        setTimeout(() => setHighLowState(null), 3000)
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

  const flyBack = useCallback(() => {
    send({ type: 'fly-back' })
  }, [send])

  const submitToPilot = useCallback(() => {
    send({ type: 'submit-to-pilot' })
  }, [send])

  const startVote = useCallback((prompt: string, options: string[], votingType: VotingState['votingType']) => {
    send({ type: 'start-vote', prompt, options, votingType, duration: 20 })
  }, [send])

  const shareClue = useCallback((clueId: string) => {
    send({ type: 'share-clue', clueId })
  }, [send])

  const submitMindMeld = useCallback((answers: string[]) => {
    send({ type: 'mind-meld-submit', answers })
    // Update local state to show we've submitted
    setMindMeldState(prev => prev ? {
      ...prev,
      phase: 'waiting'
    } : null)
  }, [send])

  const submitPopularityVote = useCallback((choice: 'A' | 'B') => {
    send({ type: 'popularity-vote', choice })
  }, [send])

  const submitHighLowVote = useCallback((choice: 'higher' | 'lower') => {
    send({ type: 'high-low-vote', choice })
  }, [send])

  const submitHighLowContinue = useCallback((choice: 'continue' | 'cash_out') => {
    send({ type: 'high-low-continue', choice })
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
      privateClues,
      clueDiscovery,
      noClueMessage,
      mindMeldState,
      popularityState,
      highLowState,
      createRoom,
      joinRoom,
      startGame,
      proceedFromIntro,
      submitVote,
      searchLocation,
      travel,
      flyBack,
      submitToPilot,
      startVote,
      clearError,
      shareClue,
      submitMindMeld,
      submitPopularityVote,
      submitHighLowVote,
      submitHighLowContinue
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
