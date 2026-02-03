import { useState } from 'react'
import { MindMeldState, Player, usePartyKit } from '../context/PartyKitContext'

interface MindMeldHostProps {
  mindMeldState: MindMeldState
  players: Player[]
}

export default function MindMeldHost({ mindMeldState, players }: MindMeldHostProps) {
  const { submitMindMeld } = usePartyKit()
  const [answers, setAnswers] = useState<[string, string, string]>(['', '', ''])
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const submittedPlayerIds = new Set(mindMeldState.submissions.map(s => s.playerId))

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers] as [string, string, string]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const validAnswers = answers.filter(a => a.trim().length > 0)
    submitMindMeld(validAnswers.length > 0 ? validAnswers : [])
    setHasSubmitted(true)
  }

  // Input/Waiting phase - show who has submitted
  if (mindMeldState.phase === 'input' || mindMeldState.phase === 'waiting') {
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '700px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.5rem',
            color: 'var(--gold)',
            marginBottom: '32px'
          }}>
            MIND MELD
          </h1>

          <div className="card" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <p style={{
              fontSize: '1.5rem',
              color: 'var(--text)',
              fontStyle: 'italic',
              marginBottom: '24px'
            }}>
              "{mindMeldState.prompt}"
            </p>

            <div className={`timer ${mindMeldState.timeRemaining <= 5 ? 'danger' : mindMeldState.timeRemaining <= 10 ? 'warning' : ''}`}
                 style={{ justifyContent: 'center', fontSize: '2rem' }}>
              {mindMeldState.timeRemaining}s
            </div>
          </div>

          {/* Host input form */}
          {!hasSubmitted && (
            <div className="card" style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
              <h3 style={{ color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center', fontSize: '0.875rem' }}>
                Your Answers:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {[0, 1, 2].map(index => (
                  <input
                    key={index}
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={`Answer ${index + 1}`}
                    style={{
                      padding: '12px',
                      fontSize: '1rem',
                      textAlign: 'center'
                    }}
                    maxLength={50}
                    autoComplete="off"
                    autoCapitalize="off"
                  />
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ width: '100%' }}
                disabled={answers.every(a => a.trim() === '')}
              >
                Submit Answers
              </button>
            </div>
          )}

          {hasSubmitted && (
            <div style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--success)' }}>
              ✓ Your answers submitted!
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginBottom: '24px'
          }}>
            {players.map(player => {
              const playerHasSubmitted = submittedPlayerIds.has(player.id)
              return (
                <div
                  key={player.id}
                  className="player-badge"
                  style={{
                    borderColor: playerHasSubmitted ? 'var(--success)' : 'var(--border)',
                    background: playerHasSubmitted ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)'
                  }}
                >
                  {playerHasSubmitted && <span style={{ color: 'var(--success)' }}>✓</span>}
                  {player.name}
                  {!playerHasSubmitted && <span style={{ color: 'var(--text-muted)' }}>...</span>}
                </div>
              )
            })}
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            Waiting for answers... {mindMeldState.submissions.length}/{players.length} submitted
          </p>
        </div>
      </div>
    )
  }

  // Revealing phase - show matches one by one
  if (mindMeldState.phase === 'revealing' && mindMeldState.results) {
    const { matches } = mindMeldState.results
    const currentIndex = mindMeldState.revealIndex ?? -1

    // Show matches revealed so far
    const revealedMatches = matches.slice(0, currentIndex + 1)
    const pointsSoFar = revealedMatches.reduce((sum, m) => sum + m.points, 0)

    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.5rem',
            color: 'var(--gold)',
            marginBottom: '32px'
          }}>
            MIND MELD
          </h1>

          {matches.length === 0 ? (
            // No matches at all - funny message
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '24px' }}>
                🤷
              </div>
              <h2 style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Zero Matches!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                You're all unique individuals. How special.
              </p>
            </div>
          ) : (
            <>
              {/* Revealed matches */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
                marginBottom: '32px'
              }}>
                {revealedMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      minWidth: '200px',
                      textAlign: 'center',
                      border: match.matchSize >= 3 ? '2px solid var(--gold)' : '1px solid var(--border)',
                      animation: idx === currentIndex ? 'pulse 0.5s ease-in-out' : undefined
                    }}
                  >
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'var(--text)',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {match.answer}
                    </div>
                    <div style={{
                      color: match.matchSize >= 3 ? 'var(--gold)' : 'var(--accent)',
                      fontSize: '1.1rem',
                      marginBottom: '8px'
                    }}>
                      {match.matchSize} players matched!
                    </div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-muted)',
                      marginBottom: '8px'
                    }}>
                      {match.playerNames.join(', ')}
                    </div>
                    <div style={{
                      color: 'var(--success)',
                      fontWeight: 'bold'
                    }}>
                      +{match.points} {match.points === 1 ? 'point' : 'points'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Running total */}
              {currentIndex >= 0 && (
                <div style={{
                  textAlign: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-muted)',
                    marginBottom: '8px'
                  }}>
                    Total Matches: {revealedMatches.length}
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    color: 'var(--gold)',
                    fontWeight: 'bold'
                  }}>
                    {pointsSoFar} Points
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // Complete phase - show final results
  if (mindMeldState.phase === 'complete' && mindMeldState.results) {
    const { matches, totalPoints, timeBonus } = mindMeldState.results

    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.5rem',
            color: 'var(--gold)',
            marginBottom: '32px'
          }}>
            MIND MELD COMPLETE!
          </h1>

          <div className="card" style={{
            padding: '48px',
            border: '2px solid var(--gold)',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
              {totalPoints >= 10 ? '🎉' : totalPoints >= 5 ? '👍' : totalPoints > 0 ? '🤝' : '🤷'}
            </div>

            <div style={{
              fontSize: '2.5rem',
              color: 'var(--gold)',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              {totalPoints} Total Points
            </div>

            <div style={{
              color: 'var(--text-muted)',
              fontSize: '1.2rem',
              marginBottom: '24px'
            }}>
              {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
            </div>

            {timeBonus > 0 && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px'
              }}>
                <div style={{ color: 'var(--success)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  +{timeBonus} Minutes Bonus!
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

  // Fallback
  return null
}
