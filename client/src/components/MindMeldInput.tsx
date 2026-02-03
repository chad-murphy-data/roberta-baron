import { useState } from 'react'
import { usePartyKit, MindMeldState } from '../context/PartyKitContext'

interface MindMeldInputProps {
  mindMeldState: MindMeldState
}

export default function MindMeldInput({ mindMeldState }: MindMeldInputProps) {
  const { submitMindMeld, players } = usePartyKit()
  const [answers, setAnswers] = useState<[string, string, string]>(['', '', ''])
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers] as [string, string, string]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (hasSubmitted) return

    // Filter out empty answers
    const validAnswers = answers.filter(a => a.trim().length > 0)

    if (validAnswers.length === 0) {
      // Allow empty submission (they just won't match)
      submitMindMeld([])
    } else {
      submitMindMeld(validAnswers)
    }

    setHasSubmitted(true)
  }

  // If we're in waiting phase (already submitted)
  if (mindMeldState.phase === 'waiting' || hasSubmitted) {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
            ✓
          </div>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>
            Answers Submitted!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Waiting for teammates...
          </p>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '16px'
          }}>
            {mindMeldState.readyCount} / {players.length} ready
          </div>
          <p style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>
            Watch the big screen!
          </p>
        </div>
      </div>
    )
  }

  // If we're in revealing or complete phase
  if (mindMeldState.phase === 'revealing' || mindMeldState.phase === 'complete') {
    return (
      <div className="centered" style={{ padding: '20px' }}>
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            Mind Meld Results
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Watch the big screen to see the matches!
          </p>
          {mindMeldState.results && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '2rem', color: 'var(--gold)' }}>
                {mindMeldState.results.totalPoints} points
              </div>
              <div style={{ color: 'var(--success)', marginTop: '8px' }}>
                +{mindMeldState.results.timeBonus} minutes bonus!
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Input phase
  return (
    <div className="centered" style={{ padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{
            color: 'var(--gold)',
            marginBottom: '8px',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '1rem'
          }}>
            MIND MELD
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text)',
            marginBottom: '16px',
            fontStyle: 'italic'
          }}>
            "{mindMeldState.prompt}"
          </p>
          <div className={`timer ${mindMeldState.timeRemaining <= 5 ? 'danger' : mindMeldState.timeRemaining <= 10 ? 'warning' : ''}`}
               style={{ justifyContent: 'center' }}>
            {mindMeldState.timeRemaining}s
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[0, 1, 2].map(index => (
            <input
              key={index}
              type="text"
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Answer ${index + 1}`}
              style={{
                padding: '16px',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}
              maxLength={50}
              autoComplete="off"
              autoCapitalize="off"
            />
          ))}
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={handleSubmit}
          style={{ width: '100%' }}
          disabled={answers.every(a => a.trim() === '')}
        >
          Submit Answers
        </button>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          Try to match your teammates!
        </p>
      </div>
    </div>
  )
}
