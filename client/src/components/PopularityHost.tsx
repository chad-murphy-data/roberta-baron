import { Player } from '../context/PartyKitContext'

interface PopularityMatchup {
  id: string
  category: string
  optionA: { name: string; value?: number; formattedValue?: string }
  optionB: { name: string; value?: number; formattedValue?: string }
  winner?: 'A' | 'B'
}

interface PopularityState {
  active: boolean
  phase: 'voting' | 'reveal' | 'complete'
  matchup: PopularityMatchup
  votes: { playerId: string; playerName: string; choice: 'A' | 'B' }[]
  timeLimit: number
  timeRemaining: number
  results?: {
    correctPlayers: string[]
    incorrectPlayers: string[]
    teamScore: number
    timeBonus: number
  }
}

interface PopularityHostProps {
  popularityState: PopularityState
  players: Player[]
}

export default function PopularityHost({ popularityState, players }: PopularityHostProps) {
  const { matchup, phase, votes, timeRemaining, results } = popularityState
  const votedPlayerIds = new Set(votes.map(v => v.playerId))

  // Voting phase
  if (phase === 'voting') {
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.25rem',
            color: 'var(--gold)',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            WHICH IS MORE POPULAR?
          </h1>

          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            marginBottom: '32px'
          }}>
            {matchup.category}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Option A */}
            <div className="card" style={{
              flex: 1,
              maxWidth: '280px',
              textAlign: 'center',
              padding: '32px 24px'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text)',
                marginBottom: '8px'
              }}>
                {matchup.optionA.name}
              </div>
              <div style={{
                fontSize: '3rem',
                color: 'var(--accent)',
                fontWeight: 'bold'
              }}>
                A
              </div>
            </div>

            <div style={{
              fontSize: '2rem',
              color: 'var(--text-muted)',
              fontWeight: 'bold'
            }}>
              vs
            </div>

            {/* Option B */}
            <div className="card" style={{
              flex: 1,
              maxWidth: '280px',
              textAlign: 'center',
              padding: '32px 24px'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text)',
                marginBottom: '8px'
              }}>
                {matchup.optionB.name}
              </div>
              <div style={{
                fontSize: '3rem',
                color: 'var(--accent)',
                fontWeight: 'bold'
              }}>
                B
              </div>
            </div>
          </div>

          <div className={`timer ${timeRemaining <= 5 ? 'danger' : timeRemaining <= 10 ? 'warning' : ''}`}
               style={{ justifyContent: 'center', fontSize: '2rem', marginBottom: '24px' }}>
            {timeRemaining}s
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {players.map(player => {
              const hasVoted = votedPlayerIds.has(player.id)
              return (
                <div
                  key={player.id}
                  className="player-badge"
                  style={{
                    borderColor: hasVoted ? 'var(--success)' : 'var(--border)',
                    background: hasVoted ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)'
                  }}
                >
                  {hasVoted && <span style={{ color: 'var(--success)' }}>✓</span>}
                  {player.name}
                  {!hasVoted && <span style={{ color: 'var(--text-muted)' }}>...</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Reveal phase
  if (phase === 'reveal' && results) {
    const winner = matchup.winner
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.25rem',
            color: 'var(--gold)',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            WHICH IS MORE POPULAR?
          </h1>

          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            marginBottom: '32px'
          }}>
            {matchup.category}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Option A */}
            <div className="card" style={{
              flex: 1,
              maxWidth: '280px',
              textAlign: 'center',
              padding: '32px 24px',
              border: winner === 'A' ? '3px solid var(--success)' : '1px solid var(--border)',
              background: winner === 'A' ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)'
            }}>
              {winner === 'A' && (
                <div style={{
                  color: 'var(--success)',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  fontSize: '0.875rem'
                }}>
                  WINNER
                </div>
              )}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text)',
                marginBottom: '16px'
              }}>
                {matchup.optionA.name}
              </div>
              <div style={{
                fontSize: '2rem',
                color: winner === 'A' ? 'var(--success)' : 'var(--text-muted)',
                fontWeight: 'bold'
              }}>
                {matchup.optionA.formattedValue || '???'}
              </div>
            </div>

            <div style={{
              fontSize: '2rem',
              color: 'var(--text-muted)',
              fontWeight: 'bold'
            }}>
              vs
            </div>

            {/* Option B */}
            <div className="card" style={{
              flex: 1,
              maxWidth: '280px',
              textAlign: 'center',
              padding: '32px 24px',
              border: winner === 'B' ? '3px solid var(--success)' : '1px solid var(--border)',
              background: winner === 'B' ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)'
            }}>
              {winner === 'B' && (
                <div style={{
                  color: 'var(--success)',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  fontSize: '0.875rem'
                }}>
                  WINNER
                </div>
              )}
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text)',
                marginBottom: '16px'
              }}>
                {matchup.optionB.name}
              </div>
              <div style={{
                fontSize: '2rem',
                color: winner === 'B' ? 'var(--success)' : 'var(--text-muted)',
                fontWeight: 'bold'
              }}>
                {matchup.optionB.formattedValue || '???'}
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--text)',
              marginBottom: '16px'
            }}>
              Team Score: {results.teamScore}/{players.length} correct
            </div>

            {results.correctPlayers.length > 0 && (
              <div style={{ color: 'var(--success)', marginBottom: '8px' }}>
                Correct: {results.correctPlayers.join(', ')}
              </div>
            )}
            {results.incorrectPlayers.length > 0 && (
              <div style={{ color: 'var(--accent)' }}>
                Incorrect: {results.incorrectPlayers.join(', ')}
              </div>
            )}
          </div>

          {results.timeBonus > 0 && (
            <div style={{
              background: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid var(--success)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                +{results.timeBonus} Minutes Bonus!
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Complete phase
  if (phase === 'complete' && results) {
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.25rem',
            color: 'var(--gold)',
            marginBottom: '32px'
          }}>
            TRIVIA COMPLETE!
          </h1>

          <div className="card" style={{
            padding: '48px',
            border: '2px solid var(--gold)',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
              {results.teamScore === players.length ? '🎉' : results.teamScore > players.length / 2 ? '👍' : '🤔'}
            </div>

            <div style={{
              fontSize: '2rem',
              color: 'var(--gold)',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              {results.teamScore}/{players.length} Correct
            </div>

            {results.timeBonus > 0 && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px'
              }}>
                <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  +{results.timeBonus} Minutes Bonus!
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
                  Added to your investigation time
                </div>
              </div>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)' }}>
            Proceeding to investigation...
          </p>
        </div>
      </div>
    )
  }

  return null
}
