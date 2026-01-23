import { useState } from 'react'

interface VotingState {
  prompt: string
  options: string[]
  votingType: 'travel' | 'search' | 'continue' | 'pilot'
  duration: number
  timeRemaining: number
  votes: Record<string, string>
  winner?: string
}

interface PlayerVotingProps {
  votingState: VotingState
  onVote: (vote: string) => void
}

export default function PlayerVoting({ votingState, onVote }: PlayerVotingProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = (option: string) => {
    if (hasVoted) return

    setSelectedOption(option)
    setHasVoted(true)
    onVote(option)
  }

  if (hasVoted) {
    return (
      <div className="centered">
        <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>
            Vote Submitted!
          </h2>
          <p style={{ marginBottom: '16px' }}>You voted for:</p>
          <p style={{ fontSize: '1.25rem', color: 'var(--gold)' }}>
            {selectedOption}
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '24px', fontSize: '0.875rem' }}>
            Waiting for other players...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="centered" style={{ padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            {votingState.prompt}
          </h2>
          <div className={`timer ${votingState.timeRemaining <= 5 ? 'danger' : votingState.timeRemaining <= 10 ? 'warning' : ''}`}
               style={{ justifyContent: 'center' }}>
            {votingState.timeRemaining}s
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {votingState.options.map(option => (
            <button
              key={option}
              className="vote-option"
              onClick={() => handleVote(option)}
              style={{
                padding: '24px',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
