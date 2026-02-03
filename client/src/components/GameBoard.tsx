import { useState } from 'react'
import { usePartyKit } from '../context/PartyKitContext'
import { CityImage } from '../utils/assets'
import { PilotInline } from './Pilot'

interface SearchLocation {
  id: string
  name: string
  description: string
}

interface CollectedClue {
  type: 'criminal' | 'destination'
  text: string
  cityFound: string
  sharedBy?: string
}

interface CurrentCompany {
  name: string
  city: string
  state: string
  industry: string
  stolenAsset: string
}

interface DestinationOption {
  name: string
  city: string
  state: string
}

interface FilteredDestination {
  name: string
  city: string
  state: string
  eliminated: boolean
  eliminatedBy?: string[]
}

interface Suspect {
  id: string
  name: string
  archetype: string
  description: string
}

interface GameState {
  currentCityIndex: number
  hoursRemaining: number
  cluesCollected: CollectedClue[]
  currentCityClues?: CollectedClue[] // Filtered clues for display
  criminalIdentified: boolean
  criminalName: string | null
  currentCompany: CurrentCompany
  availableLocations: SearchLocation[]
  searchedLocations: string[]
  totalCities: number
  destinationOptions?: string[]
  destinationOptionsWithCities?: DestinationOption[]
  // New: Evidence Board data
  filteredDestinations?: FilteredDestination[]
  destinationRecommendation?: string | null
  remainingSuspects?: Suspect[]
  identifiedSuspect?: Suspect | null
  suspectGender?: 'M' | 'F'
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

export default function GameBoard({ gameState, onSearch, onStartVote, isHost: _isHost }: GameBoardProps) {
  const [showClues, setShowClues] = useState(false)
  const [showEvidenceBoard, setShowEvidenceBoard] = useState(false)
  const { clueDiscovery } = usePartyKit()

  // Use currentCityClues if available (filtered: suspect clues persist, destination clues only for current city)
  const displayClues = gameState.currentCityClues || gameState.cluesCollected
  const criminalClues = displayClues.filter(c => c.type === 'criminal')
  const destinationClues = displayClues.filter(c => c.type === 'destination')
  const allLocationsSearched = gameState.searchedLocations.length >= 3

  const handleTravelVote = () => {
    // Use pre-set destination options with city info from game state (always exactly 4)
    const optionsWithCities = gameState.destinationOptionsWithCities || []

    if (optionsWithCities.length === 0) {
      // Fallback to simple options
      const options = gameState.destinationOptions || []
      if (options.length === 0) {
        console.error('No destination options available')
        return
      }
      onStartVote('Where should we travel next?', options, 'travel')
      return
    }

    // Format options as "Company HQ (City, ST)"
    const formattedOptions = optionsWithCities.map(opt =>
      `${opt.name} (${opt.city}, ${opt.state})`
    )

    onStartVote('Where should we travel next?', formattedOptions, 'travel')
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
      {/* City Arrival Banner */}
      <div className="city-arrival-banner">
        <CityImage
          cityName={gameState.currentCompany.city}
          companyName={gameState.currentCompany.name}
          showOverlay={true}
        />
        <div className="city-info">
          <h2>{gameState.currentCompany.city}, {gameState.currentCompany.state}</h2>
          <p>{gameState.currentCompany.name} HQ</p>
        </div>
      </div>

      {/* Current Location Header */}
      <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <PilotInline
          pose="pointing"
          message={`We're at ${gameState.currentCompany.name}. Let's search for clues!`}
        />
        <p style={{ color: 'var(--accent)', marginTop: '12px', fontSize: '0.875rem' }}>
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

      {/* Clue Discovery Banner - shows when clues are pending */}
      {clueDiscovery && clueDiscovery.unsharedCount > 0 && (
        <div className="card" style={{
          marginBottom: '24px',
          background: 'rgba(251, 191, 36, 0.15)',
          border: '2px solid var(--gold)',
          textAlign: 'center',
          animation: 'pulse 2s infinite'
        }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            🔍 {clueDiscovery.count} Clue{clueDiscovery.count > 1 ? 's' : ''} Discovered!
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
            Ask your teammates what they found.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {clueDiscovery.unsharedCount} clue{clueDiscovery.unsharedCount > 1 ? 's' : ''} waiting to be shared...
          </p>
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
          {showClues ? 'Hide' : 'Show'} Team Clue Board ({gameState.cluesCollected.length})
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setShowEvidenceBoard(!showEvidenceBoard)}
          style={{ background: 'rgba(139, 92, 246, 0.2)', borderColor: 'var(--purple, #8b5cf6)' }}
        >
          {showEvidenceBoard ? 'Hide' : 'Show'} Evidence Board
        </button>
      </div>

      {/* Evidence Board - shows filtered destinations and suspects */}
      {showEvidenceBoard && (
        <div className="card" style={{ marginBottom: '24px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--purple, #8b5cf6)' }}>
          <h3 style={{ marginBottom: '16px', color: 'var(--purple, #8b5cf6)' }}>Evidence Board</h3>

          {/* Destination Analysis */}
          {gameState.filteredDestinations && gameState.filteredDestinations.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>
                🗺️ Destination Analysis
              </h4>
              {gameState.destinationRecommendation && (
                <div style={{
                  background: 'rgba(74, 222, 128, 0.2)',
                  border: '1px solid var(--success)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                    ✓ Recommended: {gameState.destinationRecommendation}
                  </p>
                </div>
              )}
              <div style={{ display: 'grid', gap: '8px' }}>
                {gameState.filteredDestinations.map((dest, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: dest.eliminated ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                      border: `1px solid ${dest.eliminated ? 'var(--accent)' : 'var(--success)'}`,
                      opacity: dest.eliminated ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontWeight: 'bold',
                        textDecoration: dest.eliminated ? 'line-through' : 'none'
                      }}>
                        {dest.name}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {dest.city}, {dest.state}
                      </span>
                    </div>
                    {dest.eliminated && dest.eliminatedBy && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>
                        Eliminated by: "{dest.eliminatedBy[0]}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspect Analysis */}
          {gameState.remainingSuspects && gameState.remainingSuspects.length > 0 && (
            <div>
              <h4 style={{ color: 'var(--accent)', marginBottom: '12px' }}>
                🔍 Suspect Analysis ({gameState.suspectGender === 'M' ? 'Male' : 'Female'} suspects)
              </h4>
              {gameState.identifiedSuspect && (
                <div style={{
                  background: 'rgba(74, 222, 128, 0.2)',
                  border: '1px solid var(--success)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                    ✓ Identified: {gameState.identifiedSuspect.name}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {gameState.identifiedSuspect.description}
                  </p>
                </div>
              )}
              {!gameState.identifiedSuspect && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {gameState.remainingSuspects.slice(0, 6).map((suspect, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <span style={{ fontWeight: 'bold' }}>{suspect.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({suspect.archetype})
                      </span>
                    </div>
                  ))}
                  {gameState.remainingSuspects.length > 6 && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      ...and {gameState.remainingSuspects.length - 6} more suspects
                    </p>
                  )}
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
                Collect more criminal clues to narrow down suspects
              </p>
            </div>
          )}

          {!gameState.filteredDestinations?.length && !gameState.remainingSuspects?.length && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              Share clues to see destination and suspect analysis
            </p>
          )}
        </div>
      )}

      {/* Clues Display */}
      {showClues && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Team Clue Board</h3>

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
                    {clue.sharedBy && ` • Shared by ${clue.sharedBy}`}
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
                    {clue.sharedBy && ` • Shared by ${clue.sharedBy}`}
                  </p>
                </div>
              ))}
            </div>
          )}

          {gameState.cluesCollected.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              No clues on the team board yet. Search locations and share what you find!
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
