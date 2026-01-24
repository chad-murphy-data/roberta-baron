import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartyKit } from '../context/PartyKitContext'

export default function Home() {
  const navigate = useNavigate()
  const { roomCode, createRoom, joinRoom, error, clearError } = usePartyKit()

  const [mode, setMode] = useState<'home' | 'host' | 'join'>('home')
  const [playerName, setPlayerName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [fidelityMode, setFidelityMode] = useState(false)

  // Navigate when room is created/joined
  useEffect(() => {
    if (roomCode && mode === 'host') {
      navigate(`/host/${roomCode}`)
    } else if (roomCode && mode === 'join') {
      navigate(`/play/${roomCode}`)
    }
  }, [roomCode, mode, navigate])

  const handleCreateRoom = () => {
    if (playerName.trim()) {
      createRoom(playerName.trim(), fidelityMode)
    }
  }

  const handleJoinRoom = () => {
    if (playerName.trim() && joinCode.trim()) {
      joinRoom(joinCode.trim(), playerName.trim())
    }
  }

  if (mode === 'home') {
    return (
      <div className="centered">
        <div style={{ maxWidth: '600px', padding: '40px 20px' }}>
          <h1 className="pixel-font" style={{ fontSize: '1.5rem', marginBottom: '40px', color: 'var(--gold)' }}>
            All hands on deck
          </h1>

          <div style={{
            background: 'var(--card-bg)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: '1px solid var(--border)'
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              "My cousins got caught stealing jewels from the Louvre. Jewels! In 2025!
              Meanwhile, I just took Coca-Cola's 'brand authenticity' and no one even filed a police report."
            </p>
            <p style={{ marginTop: '8px', color: 'var(--accent)', fontSize: '0.875rem' }}>
              - Roberta Baron
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              className="btn btn-primary btn-large"
              onClick={() => setMode('host')}
            >
              Host a Game
            </button>
            <button
              className="btn btn-secondary btn-large"
              onClick={() => setMode('join')}
            >
              Join a Game
            </button>
          </div>

          <p style={{ marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            A multiplayer deduction game for 2-6 players
          </p>
        </div>
      </div>
    )
  }

  if (mode === 'host') {
    return (
      <div className="centered">
        <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
          <h2 style={{ marginBottom: '24px' }}>Host a New Game</h2>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              cursor: 'pointer'
            }} onClick={clearError}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={fidelityMode}
                onChange={(e) => setFidelityMode(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <span>Fidelity Mode (Internal Event)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setMode('home')}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateRoom}
              disabled={!playerName.trim()}
              style={{ flex: 1 }}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'join') {
    return (
      <div className="centered">
        <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
          <h2 style={{ marginBottom: '24px' }}>Join a Game</h2>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              cursor: 'pointer'
            }} onClick={clearError}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Room Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                letterSpacing: '0.5rem',
                fontFamily: "'Press Start 2P', monospace"
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setMode('home')}
            >
              Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || joinCode.length !== 4}
              style={{ flex: 1 }}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
