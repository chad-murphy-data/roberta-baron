import { Player } from '../context/PartyKitContext'

interface Card {
  rank: number
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  display: string
}

interface HighLowState {
  active: boolean
  phase: 'voting' | 'reveal' | 'continue_vote' | 'complete'
  currentCard: Card
  nextCard?: Card
  streak: number
  timeBanked: number
  votes: { playerId: string; playerName: string; choice: 'higher' | 'lower' }[]
  continueVotes: { playerId: string; playerName: string; choice: 'continue' | 'cash_out' }[]
  timeLimit: number
  timeRemaining: number
  lastResult?: 'correct' | 'wrong' | 'push'
  teamChoice?: 'higher' | 'lower'
  results?: {
    finalStreak: number
    timeBonus: number
    reason: 'wrong' | 'cashed_out'
  }
}

interface HighLowHostProps {
  highLowState: HighLowState
  players: Player[]
}

// Card display component
function CardDisplay({ card, isWinner, isLoser, size = 'large' }: {
  card: Card
  isWinner?: boolean
  isLoser?: boolean
  size?: 'large' | 'medium'
}) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds'
  const sizeStyles = size === 'large'
    ? { width: '120px', height: '168px', fontSize: '3rem' }
    : { width: '100px', height: '140px', fontSize: '2.5rem' }

  return (
    <div style={{
      ...sizeStyles,
      background: '#fff',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
      color: isRed ? '#d32f2f' : '#212121',
      border: isWinner
        ? '4px solid var(--success)'
        : isLoser
        ? '4px solid var(--accent)'
        : '2px solid #ccc',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      animation: isWinner || isLoser ? 'pulse 0.5s ease-in-out' : undefined
    }}>
      <div style={{ fontWeight: 'bold' }}>{card.display}</div>
    </div>
  )
}

export default function HighLowHost({ highLowState, players }: HighLowHostProps) {
  const {
    phase,
    currentCard,
    nextCard,
    streak,
    timeBanked,
    votes,
    continueVotes,
    timeRemaining,
    lastResult,
    teamChoice,
    results
  } = highLowState

  const votedPlayerIds = new Set(votes.map(v => v.playerId))
  const continueVotedPlayerIds = new Set(continueVotes.map(v => v.playerId))

  // Voting phase - Higher or Lower
  if (phase === 'voting') {
    const higherVotes = votes.filter(v => v.choice === 'higher').length
    const lowerVotes = votes.filter(v => v.choice === 'lower').length

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
            HIGH-LOW
          </h1>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            marginBottom: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Streak</div>
              <div style={{
                fontSize: '2rem',
                color: streak > 0 ? 'var(--gold)' : 'var(--text)',
                fontWeight: 'bold'
              }}>
                {streak} {streak > 0 ? '🔥' : ''}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Time Banked</div>
              <div style={{
                fontSize: '2rem',
                color: 'var(--success)',
                fontWeight: 'bold'
              }}>
                +{timeBanked} min
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <CardDisplay card={currentCard} />
          </div>

          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            color: 'var(--text)',
            marginBottom: '24px'
          }}>
            HIGHER or LOWER?
          </div>

          <div className={`timer ${timeRemaining <= 5 ? 'danger' : timeRemaining <= 10 ? 'warning' : ''}`}
               style={{ justifyContent: 'center', fontSize: '2rem', marginBottom: '24px' }}>
            {timeRemaining}s
          </div>

          {/* Vote tally */}
          {votes.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              marginBottom: '24px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>
                  {higherVotes}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>Higher</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>
                  {lowerVotes}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>Lower</div>
              </div>
            </div>
          )}

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
  if (phase === 'reveal' && nextCard) {
    const isCorrect = lastResult === 'correct'

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
            HIGH-LOW
          </h1>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '32px',
            marginBottom: '32px'
          }}>
            <CardDisplay card={currentCard} size="medium" />
            <div style={{
              fontSize: '2rem',
              color: 'var(--text-muted)'
            }}>
              →
            </div>
            <CardDisplay
              card={nextCard}
              isWinner={isCorrect}
              isLoser={!isCorrect}
            />
          </div>

          <div style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--text-muted)',
              marginBottom: '8px'
            }}>
              You said: <span style={{ color: 'var(--text)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {teamChoice}
              </span>
            </div>

            {isCorrect ? (
              <div style={{
                fontSize: '2rem',
                color: 'var(--success)',
                fontWeight: 'bold'
              }}>
                ✓ CORRECT!
              </div>
            ) : (
              <div style={{
                fontSize: '2rem',
                color: 'var(--accent)',
                fontWeight: 'bold'
              }}>
                ✗ {nextCard.rank > currentCard.rank ? 'IT WAS HIGHER' : 'IT WAS LOWER'}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Streak</div>
              <div style={{
                fontSize: '2rem',
                color: streak > 0 ? 'var(--gold)' : 'var(--text)',
                fontWeight: 'bold'
              }}>
                {streak} {streak > 0 ? '🔥' : ''}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Time Banked</div>
              <div style={{
                fontSize: '2rem',
                color: 'var(--success)',
                fontWeight: 'bold'
              }}>
                +{timeBanked} min
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Continue vote phase
  if (phase === 'continue_vote') {
    const continueCount = continueVotes.filter(v => v.choice === 'continue').length
    const cashOutCount = continueVotes.filter(v => v.choice === 'cash_out').length

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
            KEEP GOING?
          </h1>

          <div style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--text)',
              marginBottom: '8px'
            }}>
              Streak: {streak} 🔥 = +{timeBanked} minutes banked
            </div>
            <div style={{
              color: 'var(--text-muted)'
            }}>
              Risk it for more, or cash out now?
            </div>
          </div>

          <div className={`timer ${timeRemaining <= 5 ? 'danger' : ''}`}
               style={{ justifyContent: 'center', fontSize: '2rem', marginBottom: '24px' }}>
            {timeRemaining}s
          </div>

          {/* Vote tally */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '48px',
            marginBottom: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                {continueCount}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Keep Going</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
                {cashOutCount}
              </div>
              <div style={{ color: 'var(--text-muted)' }}>Cash Out</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {players.map(player => {
              const hasVoted = continueVotedPlayerIds.has(player.id)
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

  // Complete phase
  if (phase === 'complete' && results) {
    const { finalStreak, timeBonus, reason } = results

    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1.25rem',
            color: 'var(--gold)',
            marginBottom: '32px'
          }}>
            {reason === 'cashed_out' ? 'CASHED OUT!' : 'GAME OVER!'}
          </h1>

          <div className="card" style={{
            padding: '48px',
            border: '2px solid var(--gold)',
            marginBottom: '32px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>
              {reason === 'cashed_out'
                ? (finalStreak >= 3 ? '🎰' : '💰')
                : '😬'}
            </div>

            <div style={{
              fontSize: '2rem',
              color: 'var(--gold)',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Final Streak: {finalStreak} {finalStreak > 0 ? '🔥' : ''}
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

            {timeBonus === 0 && (
              <div style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
                No bonus earned this round
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
