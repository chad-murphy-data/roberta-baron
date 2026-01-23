import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useGame } from '../context/GameContext'
import PlayerLobby from '../components/PlayerLobby'
import PlayerVoting from '../components/PlayerVoting'
import PlayerClueView from '../components/PlayerClueView'

export default function PlayerGame() {
  const { roomCode: urlRoomCode } = useParams()
  const navigate = useNavigate()
  const { isConnected } = useSocket()
  const {
    roomCode,
    players,
    gameState,
    votingState,
    submitVote,
    error
  } = useGame()

  // Redirect if not in the right room
  useEffect(() => {
    if (!isConnected) return
    if (roomCode && roomCode !== urlRoomCode) {
      navigate(`/play/${roomCode}`)
    }
  }, [roomCode, urlRoomCode, isConnected, navigate])

  if (!isConnected) {
    return (
      <div className="centered">
        <p>Connecting to server...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="centered">
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>Error</h2>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/')}
            style={{ marginTop: '24px' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Lobby - waiting for game to start
  if (!gameState || gameState.gamePhase === 'lobby') {
    return (
      <PlayerLobby
        roomCode={urlRoomCode || ''}
        players={players}
      />
    )
  }

  // Intro screen - simple wait message
  if (gameState.gamePhase === 'intro') {
    return (
      <div className="centered">
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>The Hunt Begins!</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Watch the main screen for the briefing...
          </p>
        </div>
      </div>
    )
  }

  // Victory/Defeat - celebration/commiseration
  if (gameState.gamePhase === 'victory') {
    return (
      <div className="centered" style={{ background: 'linear-gradient(135deg, #1a4731 0%, #065f46 100%)' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</h1>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>Victory!</h2>
          <p>{gameState.criminalName} has been apprehended!</p>
        </div>
      </div>
    )
  }

  if (gameState.gamePhase === 'defeat') {
    return (
      <div className="centered" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>😔</h1>
          <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>Escaped!</h2>
          <p>The criminal got away. Better luck next time!</p>
        </div>
      </div>
    )
  }

  // Voting mode
  if (votingState && !votingState.winner) {
    return (
      <PlayerVoting
        votingState={votingState}
        onVote={submitVote}
      />
    )
  }

  // Vote result display
  if (votingState && votingState.winner) {
    return (
      <div className="centered">
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>Vote Result</h2>
          <p style={{ color: 'var(--gold)', fontSize: '1.5rem' }}>
            {votingState.winner}
          </p>
        </div>
      </div>
    )
  }

  // Default - show clues and status
  return (
    <PlayerClueView
      gameState={gameState}
      players={players}
    />
  )
}
