import { useState } from 'react'

interface SearchLocation {
  id: string
  name: string
  description: string
}

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
  availableLocations: SearchLocation[]
  searchedLocations: string[]
  totalCities: number
}

interface VotingType {
  votingType: 'travel' | 'search' | 'continue' | 'pilot'
}

interface GameBoardProps {
  gameState: GameState
  onSearch: (locationId: string) => void
  onStartVote: (prompt: string, options: string[], votingType: VotingType['votingType']) => void
  isHost: boolean
}

export default function GameBoard({ gameState, onSearch, onStartVote, isHost }: GameBoardProps) {
  const [showClues, setShowClues] = useState(false)

  const criminalClues = gameState.cluesCollected.filter(c => c.type === 'criminal')
  const destinationClues = gameState.cluesCollected.filter(c => c.type === 'destination')
  const allLocationsSearched = gameState.searchedLocations.length >= 3

  const handleTravelVote = () => {
    // Generate destination options
    const options = [
      'Seattle, WA',
      'San Francisco, CA',
      'Austin, TX',
      'Chicago, IL',
      'Atlanta, GA',
      'New York City, NY',
      'Boston, MA'
    ].filter(() => Math.random() > 0.5).slice(0, 4)

    onStartVote('Where should we travel next?', options, 'travel')
  }

  const handlePilotVote = () => {
    onStartVote(
      'Submit clues to Pilot for criminal identification?',
      ['Yes, file the ticket', 'No, keep investigating'],
      'pilot'
    )
  }

  return (
    <div className="container">
      {/* Current Location Header */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Currently at</p>
        <h2 style={{ color: 'var(--gold)', marginBottom: '8px' }}>
          {gameState.currentCompany.name}
        </h2>
        <p>{gameState.currentCompany.city}, {gameState.currentCompany.state}</p>
        <p style={{ color: 'var(--accent)', marginTop: '8px', fontSize: '0.875rem' }}>
          Missing: "{gameState.currentCompany.stolenAsset}"
        </p>
      </div>

      {/* Criminal ID Status */}
      {gameState.criminalIdentified && (
        <div className="card" style={{
          marginBottom: '24px',
          background: 'rgba(74, 222, 128, 0.2)',
          border: '1px solid var(--success)'
        }}>
          <h3 style={{ color: 'var(--success)', marginBottom: '8px' }}>
            SUSPECT IDENTIFIED
          </h3>
          <p style={{ fontSize: '1.25rem' }}>{gameState.criminalName}</p>
        </div>
      )}

      {/* Search Locations */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Search Locations (1 hour each)</h3>
        <div className="location-grid">
          {gameState.availableLocations?.map(location => {
            const isSearched = gameState.searchedLocations.includes(location.id)
            return (
              <div
                key={location.id}
                className={`location-card ${isSearched ? 'searched' : ''}`}
                onClick={() => !isSearched && onSearch(location.id)}
              >
                <h4>{location.name}</h4>
                <p>{location.description}</p>
                {isSearched && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '4px 8px',
                    background: 'var(--success)',
                    borderRadius: '4px',
                    fontSize: '0.75rem'
                  }}>
                    Searched
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <button
          className="btn btn-primary"
          onClick={handleTravelVote}
          disabled={gameState.searchedLocations.length === 0}
        >
          Vote: Travel to Next City (4-5 hrs)
        </button>

        <button
          className="btn btn-secondary"
          onClick={handlePilotVote}
          disabled={criminalClues.length === 0}
        >
          Vote: File Ticket with Pilot (2 hrs)
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setShowClues(!showClues)}
        >
          {showClues ? 'Hide' : 'Show'} Collected Clues ({gameState.cluesCollected.length})
        </button>
      </div>

      {/* Clues Display */}
      {showClues && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Collected Clues</h3>

          {criminalClues.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '12px' }}>
                Suspect Clues ({criminalClues.length})
              </h4>
              {criminalClues.map((clue, i) => (
                <div key={i} className="clue-card">
                  <div className="clue-type">Criminal Clue</div>
                  <p>"{clue.text}"</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Found at {clue.cityFound}
                  </p>
                </div>
              ))}
            </div>
          )}

          {destinationClues.length > 0 && (
            <div>
              <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>
                Destination Clues ({destinationClues.length})
              </h4>
              {destinationClues.map((clue, i) => (
                <div key={i} className="clue-card">
                  <div className="clue-type" style={{ color: 'var(--gold)' }}>Destination Clue</div>
                  <p>"{clue.text}"</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Found at {clue.cityFound}
                  </p>
                </div>
              ))}
            </div>
          )}

          {gameState.cluesCollected.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              No clues collected yet. Search locations to find clues!
            </p>
          )}
        </div>
      )}

      {/* Hints */}
      {!allLocationsSearched && gameState.searchedLocations.length > 0 && (
        <div className="card" style={{ marginTop: '24px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid var(--warning)' }}>
          <p style={{ color: 'var(--warning)' }}>
            Tip: You can search more locations for additional clues, or vote to move to the next city.
          </p>
        </div>
      )}
    </div>
  )
}
