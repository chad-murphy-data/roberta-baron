interface Player {
  id: string
  name: string
  isHost?: boolean
}

interface VotingState {
  prompt: string
  options: string[]
  votingType: 'travel' | 'search' | 'continue' | 'pilot'
  duration: number
  timeRemaining: number
  votes: Record<string, string>
  winner?: string
}

interface VotingDisplayProps {
  votingState: VotingState
  players: Player[]
  isHost: boolean
}

export default function VotingDisplay({ votingState, players }: VotingDisplayProps) {
  const votesReceived = Object.keys(votingState.votes).length
  const totalPlayers = players.length

  // Count votes for each option
  const voteCounts: Record<string, number> = {}
  votingState.options.forEach(opt => { voteCounts[opt] = 0 })
  Object.values(votingState.votes).forEach(vote => {
    if (voteCounts[vote] !== undefined) {
      voteCounts[vote]++
    }
  })

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--gold)' }}>
          {votingState.prompt}
        </h2>

        {!votingState.winner && (
          <>
            <div className={`timer ${votingState.timeRemaining <= 5 ? 'danger' : votingState.timeRemaining <= 10 ? 'warning' : ''}`}
                 style={{ justifyContent: 'center', marginBottom: '16px' }}>
              {votingState.timeRemaining}s remaining
            </div>

            <p style={{ color: 'var(--text-muted)' }}>
              Votes received: {votesReceived}/{totalPlayers}
            </p>
          </>
        )}

        {votingState.winner && (
          <div style={{
            background: 'rgba(255, 215, 0, 0.2)',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Result:</p>
            <p style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>
              {votingState.winner}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {votingState.options.map(option => {
          const count = voteCounts[option] || 0
          const percentage = totalPlayers > 0 ? (count / totalPlayers) * 100 : 0
          const isWinner = votingState.winner === option

          return (
            <div
              key={option}
              className={`vote-option ${isWinner ? 'winner' : ''}`}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {/* Progress bar background */}
              {votingState.winner && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    background: isWinner ? 'rgba(255, 215, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    transition: 'width 0.5s ease'
                  }}
                />
              )}

              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>{option}</span>
                {votingState.winner && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {count} vote{count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)' }}>
        Players vote on their phones
      </p>
    </div>
  )
}
