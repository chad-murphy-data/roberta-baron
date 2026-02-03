import { usePartyKit, PrivateClue } from '../context/PartyKitContext'
import { PilotInline } from './Pilot'
import { CityImage } from '../utils/assets'

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

interface GameState {
  currentCityIndex: number
  hoursRemaining: number
  cluesCollected: CollectedClue[]
  currentCityClues?: CollectedClue[]
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

// Component for displaying a private clue that can be shared
function PrivateClueCard({ privateClue, onShare }: { privateClue: PrivateClue; onShare: (clueId: string) => void }) {
  const { clue, clueId, shared } = privateClue
  const isDestinationClue = clue.type === 'destination'

  return (
    <div className="card" style={{
      marginBottom: '16px',
      background: shared
        ? 'rgba(74, 222, 128, 0.1)'
        : isDestinationClue
          ? 'rgba(251, 191, 36, 0.15)'
          : 'rgba(239, 68, 68, 0.15)',
      border: shared
        ? '2px solid var(--success)'
        : isDestinationClue
          ? '2px solid var(--gold)'
          : '2px solid var(--accent)',
      padding: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        color: isDestinationClue ? 'var(--gold)' : 'var(--accent)',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        {isDestinationClue ? '🗺️' : '🔍'} YOU DISCOVERED:
      </div>

      <p style={{
        fontSize: '1.1rem',
        marginBottom: '12px',
        lineHeight: '1.5'
      }}>
        "{clue.text}"
      </p>

      {!shared ? (
        <>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            marginBottom: '12px',
            fontStyle: 'italic'
          }}>
            Share this with your team verbally, then tap below:
          </p>
          <button
            onClick={() => onShare(clueId)}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            ✓ I've Shared This With My Team
          </button>
        </>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          background: 'rgba(74, 222, 128, 0.2)',
          borderRadius: '8px',
          color: 'var(--success)',
          fontWeight: 'bold'
        }}>
          ✓ Shared with team
        </div>
      )}
    </div>
  )
}

export default function PlayerClueView({ gameState }: PlayerClueViewProps) {
  const { privateClues, noClueMessage, shareClue, clueDiscovery } = usePartyKit()

  // Filter private clues to only show unshared ones prominently
  const unsharedClues = privateClues.filter(pc => !pc.shared)
  const recentlyShared = privateClues.filter(pc => pc.shared)

  // Use city-specific clues if available (destination clues only for current city)
  const displayClues = gameState.currentCityClues || gameState.cluesCollected
  const criminalClues = displayClues.filter(c => c.type === 'criminal')
  const destinationClues = displayClues.filter(c => c.type === 'destination')

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

      {/* Current Location with City Image */}
      <div className="card" style={{ marginBottom: '20px', padding: '0', overflow: 'hidden' }}>
        <div style={{ height: '80px', position: 'relative' }}>
          <CityImage
            cityName={gameState.currentCompany.city}
            companyName={gameState.currentCompany.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '12px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--gold)', fontSize: '1rem' }}>{gameState.currentCompany.name}</h3>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              {gameState.currentCompany.city}, {gameState.currentCompany.state}
            </p>
          </div>
        </div>
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

      {/* Private Clues Section - PROMINENT */}
      {unsharedClues.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            marginBottom: '12px',
            textAlign: 'center',
            color: 'var(--accent)'
          }}>
            🔍 Your Private Clue{unsharedClues.length > 1 ? 's' : ''}!
          </h3>
          {unsharedClues.map(pc => (
            <PrivateClueCard
              key={pc.clueId}
              privateClue={pc}
              onShare={shareClue}
            />
          ))}
        </div>
      )}

      {/* No clue message - when another player found clues */}
      {noClueMessage && unsharedClues.length === 0 && clueDiscovery && clueDiscovery.unsharedCount > 0 && (
        <div className="card" style={{
          marginBottom: '20px',
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid var(--warning)',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>
            {noClueMessage}
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.875rem' }}>
            {clueDiscovery.searcherName ? `Ask ${clueDiscovery.searcherName} what they found!` : `${clueDiscovery.unsharedCount} clue${clueDiscovery.unsharedCount > 1 ? 's' : ''} still waiting to be shared...`}
          </p>
        </div>
      )}

      {/* Recently Shared by You */}
      {recentlyShared.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            marginBottom: '12px',
            color: 'var(--success)',
            fontSize: '0.875rem'
          }}>
            ✓ You Shared:
          </h4>
          {recentlyShared.map(pc => (
            <PrivateClueCard
              key={pc.clueId}
              privateClue={pc}
              onShare={shareClue}
            />
          ))}
        </div>
      )}

      {/* Shared Clues (Team Board) */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', textAlign: 'center' }}>
          Team Clue Board ({displayClues.length})
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
                  {clue.sharedBy && ` • Shared by ${clue.sharedBy}`}
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
                  {clue.sharedBy && ` • Shared by ${clue.sharedBy}`}
                </p>
              </div>
            ))}
          </div>
        )}

        {displayClues.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
            No clues on the team board yet
          </p>
        )}
      </div>

      {/* Instructions with Pilot */}
      <div style={{ marginTop: '20px' }}>
        <PilotInline
          pose="hi"
          message="Watch the main screen for updates. Voting will appear here!"
          size={36}
        />
      </div>
    </div>
  )
}
