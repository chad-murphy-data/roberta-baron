import { useState } from 'react'
import { usePartyKit } from '../context/PartyKitContext'

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

interface HighLowInputProps {
  highLowState: HighLowState
}

// Compact card display for player screen
function CardDisplay({ card }: { card: Card }) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds'

  return (
    <div style={{
      width: '80px',
      height: '112px',
      background: '#fff',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
      color: isRed ? '#d32f2f' : '#212121',
      border: '2px solid #ccc',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      {card.display}
    </div>
  )
}

export default function HighLowInput({ highLowState }: HighLowInputProps) {
  const { submitHighLowVote, submitHighLowContinue, players } = usePartyKit()
  const [hasVoted, setHasVoted] = useState(false)
  const [hasContinueVoted, setHasContinueVoted] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<'higher' | 'lower' | null>(null)
  const [selectedContinue, setSelectedContinue] = useState<'continue' | 'cash_out' | null>(null)

  const {
    phase,
    currentCard,
    nextCard,
    streak,
    timeBanked,
    timeRemaining,
    lastResult,
    teamChoice,
    results,
    votes,
    continueVotes
  } = highLowState

  const handleVote = (choice: 'higher' | 'lower') => {
    if (hasVoted) return
    setSelectedChoice(choice)
    setHasVoted(true)
    submitHighLowVote(choice)
  }

  const handleContinueVote = (choice: 'continue' | 'cash_out') => {
    if (hasContinueVoted) return
    setSelectedContinue(choice)
    setHasContinueVoted(true)
    submitHighLowContinue(choice)
  }

  // Voting phase - pick higher or lower
  if (phase === 'voting' && !hasVoted) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{
              color: 'var(--gold)',
              marginBottom: '8px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.875rem'
            }}>
              HIGH-LOW
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Streak</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
                  {streak} {streak > 0 ? '🔥' : ''}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Banked</div>
                <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                  +{timeBanked}m
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <CardDisplay card={currentCard} />
            </div>

            <div className={`timer ${timeRemaining <= 5 ? 'danger' : timeRemaining <= 10 ? 'warning' : ''}`}
                 style={{ justifyContent: 'center' }}>
              {timeRemaining}s
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <button
              className="btn btn-large"
              onClick={() => handleVote('higher')}
              style={{
                flex: 1,
                padding: '24px 16px',
                fontSize: '1.2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              ↑ HIGHER
            </button>

            <button
              className="btn btn-large"
              onClick={() => handleVote('lower')}
              style={{
                flex: 1,
                padding: '24px 16px',
                fontSize: '1.2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              ↓ LOWER
            </button>
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            Will the next card be higher or lower?
          </p>
        </div>
      </div>
    )
  }

  // Voted, waiting for others
  if (phase === 'voting' && hasVoted) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            ✓
          </div>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>
            Vote Submitted!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            You said: <span style={{
              color: 'var(--text)',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {selectedChoice}
            </span>
          </p>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '16px'
          }}>
            {votes.length} / {players.length} voted
          </div>
          <p style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
            Watch the big screen!
          </p>
        </div>
      </div>
    )
  }

  // Reveal phase
  if (phase === 'reveal' && nextCard) {
    const isCorrect = lastResult === 'correct'

    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            {isCorrect ? '🎉' : '😬'}
          </div>
          <h2 style={{
            color: isCorrect ? 'var(--success)' : 'var(--accent)',
            marginBottom: '16px'
          }}>
            {isCorrect ? 'CORRECT!' : 'WRONG!'}
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <CardDisplay card={currentCard} />
            <div style={{ color: 'var(--text-muted)' }}>→</div>
            <CardDisplay card={nextCard} />
          </div>

          <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
            Team said: <span style={{ color: 'var(--text)', textTransform: 'uppercase' }}>
              {teamChoice}
            </span>
          </div>

          {isCorrect && (
            <div style={{
              color: 'var(--gold)',
              fontWeight: 'bold'
            }}>
              Streak: {streak} 🔥 (+{timeBanked} min banked)
            </div>
          )}
        </div>
      </div>
    )
  }

  // Continue vote phase
  if (phase === 'continue_vote' && !hasContinueVoted) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <h2 style={{
              color: 'var(--gold)',
              marginBottom: '16px',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.875rem'
            }}>
              KEEP GOING?
            </h2>
            <div style={{
              fontSize: '1.5rem',
              color: 'var(--text)',
              marginBottom: '8px'
            }}>
              Streak: {streak} 🔥
            </div>
            <div style={{
              color: 'var(--success)',
              marginBottom: '16px'
            }}>
              +{timeBanked} minutes banked
            </div>
            <div className={`timer ${timeRemaining <= 5 ? 'danger' : ''}`}
                 style={{ justifyContent: 'center' }}>
              {timeRemaining}s
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              className="btn btn-large"
              onClick={() => handleContinueVote('continue')}
              style={{
                flex: 1,
                padding: '24px 16px',
                fontSize: '1rem',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '2px solid var(--success)',
                color: 'var(--success)',
                cursor: 'pointer'
              }}
            >
              KEEP GOING
            </button>

            <button
              className="btn btn-large"
              onClick={() => handleContinueVote('cash_out')}
              style={{
                flex: 1,
                padding: '24px 16px',
                fontSize: '1rem',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '2px solid var(--gold)',
                color: 'var(--gold)',
                cursor: 'pointer'
              }}
            >
              CASH OUT
            </button>
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Risk it for more, or keep what you've won?
          </p>
        </div>
      </div>
    )
  }

  // Continue vote submitted
  if (phase === 'continue_vote' && hasContinueVoted) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            ✓
          </div>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>
            Vote Submitted!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            You voted to: <span style={{
              color: selectedContinue === 'continue' ? 'var(--success)' : 'var(--gold)',
              fontWeight: 'bold'
            }}>
              {selectedContinue === 'continue' ? 'Keep Going' : 'Cash Out'}
            </span>
          </p>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}>
            {continueVotes.length} / {players.length} voted
          </div>
        </div>
      </div>
    )
  }

  // Complete phase
  if (phase === 'complete' && results) {
    const { finalStreak, timeBonus, reason } = results

    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            {reason === 'cashed_out' ? 'Cashed Out!' : 'Game Over!'}
          </h2>
          <div style={{
            fontSize: '2rem',
            marginBottom: '8px'
          }}>
            {reason === 'cashed_out' ? '💰' : '😬'}
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: 'var(--text)',
            marginBottom: '8px'
          }}>
            Final Streak: {finalStreak} {finalStreak > 0 ? '🔥' : ''}
          </div>
          {timeBonus > 0 && (
            <div style={{
              color: 'var(--success)',
              fontWeight: 'bold',
              marginTop: '8px'
            }}>
              +{timeBonus} minutes added!
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
            Returning to investigation...
          </p>
        </div>
      </div>
    )
  }

  return null
}
