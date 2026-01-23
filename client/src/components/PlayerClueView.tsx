interface CollectedClue {
  type: 'criminal' | 'destination'
  text: string
  cityFound: string
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
  currentCompany: CurrentCompany
  totalCities: number
}

interface Player {
  id: string
  name: string
  isHost?: boolean
}

interface PlayerClueViewProps {
  gameState: GameState
  players: Player[]
}

export default function PlayerClueView({ gameState }: PlayerClueViewProps) {
  const criminalClues = gameState.cluesCollected.filter(c => c.type === 'criminal')
  const destinationClues = gameState.cluesCollected.filter(c => c.type === 'destination')

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      {/* Status Header */}
      <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <div className={`timer ${gameState.hoursRemaining <= 10 ? 'danger' : gameState.hoursRemaining <= 20 ? 'warning' : ''}`}
             style={{ justifyContent: 'center', marginBottom: '12px' }}>
          {gameState.hoursRemaining} hrs left
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          City {gameState.currentCityIndex + 1} of {gameState.totalCities}
        </p>
      </div>

      {/* Current Location */}
      <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>
          Currently at
        </p>
        <h3 style={{ color: 'var(--gold)' }}>{gameState.currentCompany.name}</h3>
        <p style={{ fontSize: '0.875rem' }}>
          {gameState.currentCompany.city}, {gameState.currentCompany.state}
        </p>
      </div>

      {/* Criminal ID Status */}
      {gameState.criminalIdentified && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'rgba(74, 222, 128, 0.2)',
          border: '1px solid var(--success)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--success)', fontSize: '0.75rem', marginBottom: '4px' }}>
            SUSPECT IDENTIFIED
          </p>
          <h3>{gameState.criminalName}</h3>
        </div>
      )}

      {/* Clues */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>
          Collected Clues ({gameState.cluesCollected.length})
        </h3>

        {criminalClues.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'var(--accent)', marginBottom: '12px', fontSize: '0.875rem' }}>
              Suspect Clues ({criminalClues.length})
            </h4>
            {criminalClues.map((clue, i) => (
              <div key={i} className="clue-card" style={{ padding: '12px' }}>
                <p style={{ fontSize: '0.9rem' }}>"{clue.text}"</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {clue.cityFound}
                </p>
              </div>
            ))}
          </div>
        )}

        {destinationClues.length > 0 && (
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '0.875rem' }}>
              Destination Clues ({destinationClues.length})
            </h4>
            {destinationClues.map((clue, i) => (
              <div key={i} className="clue-card" style={{ padding: '12px' }}>
                <p style={{ fontSize: '0.9rem' }}>"{clue.text}"</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {clue.cityFound}
                </p>
              </div>
            ))}
          </div>
        )}

        {gameState.cluesCollected.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
            No clues collected yet
          </p>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>Watch the main screen for updates</p>
        <p style={{ marginTop: '8px' }}>Voting will appear here when it's time to decide</p>
      </div>
    </div>
  )
}
