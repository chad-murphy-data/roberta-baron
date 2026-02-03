import { useState } from 'react'
import { sounds } from '../utils/sounds'
import Pilot from './Pilot'
import { PilotPose } from '../utils/assets'

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

// Get appropriate Pilot pose based on voting type and time
function getPilotPose(votingType: string, timeRemaining: number): PilotPose {
  if (timeRemaining <= 5) return 'worried'
  if (votingType === 'travel') return 'pointing'
  if (votingType === 'pilot') return 'hi'
  return 'pointing'
}

export default function PlayerVoting({ votingState, onVote }: PlayerVotingProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = (option: string) => {
    if (hasVoted) return

    setSelectedOption(option)
    setHasVoted(true)
    sounds.play('vote-submit')
    onVote(option)
  }

  const pilotPose = getPilotPose(votingState.votingType, votingState.timeRemaining)

  if (hasVoted) {
    return (
      <div className="centered">
        <Pilot
          pose="hi"
          message={`Got it! You voted for "${selectedOption}". Waiting for the team...`}
          typingSpeed={0}
          size="small"
        />
        <p style={{ color: 'var(--text-muted)', marginTop: '24px', fontSize: '0.875rem' }}>
          Waiting for other players...
        </p>
      </div>
    )
  }

  return (
    <div className="centered" style={{ padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* Pilot with speech bubble containing the prompt */}
        <Pilot
          pose={pilotPose}
          message={votingState.prompt}
          typingSpeed={0}
          size="small"
        >
          {/* Timer inside Pilot area */}
          <div
            className={`timer ${votingState.timeRemaining <= 5 ? 'danger' : votingState.timeRemaining <= 10 ? 'warning' : ''}`}
            style={{ justifyContent: 'center', marginTop: '8px' }}
          >
            {votingState.timeRemaining}s
          </div>
        </Pilot>

        {/* Vote options as buttons below the Pilot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          {votingState.options.map(option => (
            <button
              key={option}
              className="vote-option"
              onClick={() => handleVote(option)}
              style={{
                padding: '20px',
                fontSize: '1rem',
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
