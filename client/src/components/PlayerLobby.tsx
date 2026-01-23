interface Player {
  id: string
  name: string
  isHost?: boolean
}

interface PlayerLobbyProps {
  roomCode: string
  players: Player[]
}

export default function PlayerLobby({ roomCode, players }: PlayerLobbyProps) {
  return (
    <div className="centered">
      <div style={{ maxWidth: '400px', width: '100%', padding: '20px' }}>
        <h1 className="pixel-font" style={{ fontSize: '1rem', marginBottom: '24px', color: 'var(--gold)' }}>
          ALL HANDS ON DECK
        </h1>

        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Room Code</p>
          <div className="room-code" style={{ fontSize: '2rem' }}>{roomCode}</div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>
            Players ({players.length}/6)
          </h3>
          <div className="player-list" style={{ justifyContent: 'center' }}>
            {players.map(player => (
              <span key={player.id} className={`player-badge ${player.isHost ? 'host' : ''}`}>
                {player.isHost && <span className="host-icon">★</span>}
                {player.name}
              </span>
            ))}
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>👀</p>
          <p>Waiting for host to start the game...</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '12px' }}>
            Look at the main screen for game updates
          </p>
        </div>
      </div>
    </div>
  )
}
