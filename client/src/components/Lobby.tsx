interface Player {
  id: string
  name: string
  isHost?: boolean
}

interface LobbyProps {
  roomCode: string
  players: Player[]
  isHost: boolean
  onStartGame: () => void
  error: string | null
}

export default function Lobby({ roomCode, players, isHost, onStartGame, error }: LobbyProps) {
  const canStart = players.length >= 2

  return (
    <div className="centered">
      <div style={{ maxWidth: '600px', width: '100%', padding: '20px' }}>
        <h1 className="pixel-font" style={{ fontSize: '1.25rem', marginBottom: '24px', color: 'var(--gold)' }}>
          All hands on deck
        </h1>

        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Room Code</p>
          <div className="room-code">{roomCode}</div>
          <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.875rem' }}>
            Share this code with your team to join!
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            Players ({players.length}/6)
          </h3>
          <div className="player-list" style={{ justifyContent: 'flex-start' }}>
            {players.map(player => (
              <span key={player.id} className={`player-badge ${player.isHost ? 'host' : ''}`}>
                {player.isHost && <span className="host-icon">★</span>}
                {player.name}
              </span>
            ))}
          </div>

          {players.length < 2 && (
            <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.875rem' }}>
              Need at least 2 players to start
            </p>
          )}
        </div>

        {isHost && (
          <button
            className="btn btn-primary btn-large"
            onClick={onStartGame}
            disabled={!canStart}
            style={{ width: '100%' }}
          >
            {canStart ? 'Start Game' : 'Waiting for players...'}
          </button>
        )}

        {!isHost && (
          <div className="card" style={{ textAlign: 'center' }}>
            <p>Waiting for host to start the game...</p>
          </div>
        )}
      </div>
    </div>
  )
}
