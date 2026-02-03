import { useState } from 'react'
import { usePartyKit } from '../context/PartyKitContext'

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

interface PopularityInputProps {
  popularityState: PopularityState
}

export default function PopularityInput({ popularityState }: PopularityInputProps) {
  const { submitPopularityVote, players } = usePartyKit()
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null)

  const { matchup, phase, timeRemaining, results, votes } = popularityState

  const handleVote = (choice: 'A' | 'B') => {
    if (hasVoted) return
    setSelectedChoice(choice)
    setHasVoted(true)
    submitPopularityVote(choice)
  }

  // Voting phase
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
              WHICH IS MORE POPULAR?
            </h2>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              marginBottom: '16px'
            }}>
              {matchup.category}
            </p>
            <div className={`timer ${timeRemaining <= 5 ? 'danger' : timeRemaining <= 10 ? 'warning' : ''}`}
                 style={{ justifyContent: 'center' }}>
              {timeRemaining}s
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              className="btn btn-large"
              onClick={() => handleVote('A')}
              style={{
                padding: '24px',
                fontSize: '1.2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '12px', color: 'var(--accent)' }}>A</span>
              {matchup.optionA.name}
            </button>

            <button
              className="btn btn-large"
              onClick={() => handleVote('B')}
              style={{
                padding: '24px',
                fontSize: '1.2rem',
                background: 'var(--card-bg)',
                border: '2px solid var(--border)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '1.5rem', marginRight: '12px', color: 'var(--accent)' }}>B</span>
              {matchup.optionB.name}
            </button>
          </div>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Which one has more {matchup.category.toLowerCase()}?
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
            You picked: <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>
              {selectedChoice === 'A' ? matchup.optionA.name : matchup.optionB.name}
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
  if (phase === 'reveal' && results) {
    const winner = matchup.winner
    const wasCorrect = selectedChoice === winner

    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            {wasCorrect ? '🎉' : '😅'}
          </div>
          <h2 style={{
            color: wasCorrect ? 'var(--success)' : 'var(--accent)',
            marginBottom: '16px'
          }}>
            {wasCorrect ? 'You got it!' : 'Not quite!'}
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <div style={{
              padding: '16px',
              background: winner === 'A' ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)',
              border: winner === 'A' ? '2px solid var(--success)' : '1px solid var(--border)',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                {matchup.optionA.name}
              </div>
              <div style={{ color: winner === 'A' ? 'var(--success)' : 'var(--text-muted)', fontSize: '1.25rem' }}>
                {matchup.optionA.formattedValue}
              </div>
            </div>

            <div style={{
              padding: '16px',
              background: winner === 'B' ? 'rgba(74, 222, 128, 0.1)' : 'var(--card-bg)',
              border: winner === 'B' ? '2px solid var(--success)' : '1px solid var(--border)',
              borderRadius: '8px'
            }}>
              <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                {matchup.optionB.name}
              </div>
              <div style={{ color: winner === 'B' ? 'var(--success)' : 'var(--text-muted)', fontSize: '1.25rem' }}>
                {matchup.optionB.formattedValue}
              </div>
            </div>
          </div>

          <div style={{ color: 'var(--text-muted)' }}>
            Team Score: {results.teamScore}/{players.length}
          </div>
          {results.timeBonus > 0 && (
            <div style={{ color: 'var(--success)', marginTop: '8px', fontWeight: 'bold' }}>
              +{results.timeBonus} minutes bonus!
            </div>
          )}
        </div>
      </div>
    )
  }

  // Complete phase
  if (phase === 'complete' && results) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            Trivia Complete!
          </h2>
          <div style={{ fontSize: '2rem', color: 'var(--text)', marginBottom: '8px' }}>
            {results.teamScore}/{players.length} correct
          </div>
          {results.timeBonus > 0 && (
            <div style={{ color: 'var(--success)', marginTop: '8px' }}>
              +{results.timeBonus} minutes added!
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
