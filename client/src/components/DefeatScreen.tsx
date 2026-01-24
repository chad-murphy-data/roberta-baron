interface DefeatScreenProps {
  message: string
  onPlayAgain?: () => void
}

export default function DefeatScreen({ message, onPlayAgain }: DefeatScreenProps) {
  return (
    <div className="defeat-screen">
      <div style={{
        textAlign: 'center',
        padding: '40px',
        maxWidth: '600px'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>😔</div>

        <h1 className="pixel-font" style={{
          fontSize: '1.5rem',
          color: 'var(--error)',
          marginBottom: '24px'
        }}>
          SUSPECT ESCAPED
        </h1>

        <div className="card" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid var(--error)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.3)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            🏃
          </div>

          <div style={{
            whiteSpace: 'pre-line',
            color: 'var(--text)',
            lineHeight: 1.8,
            marginBottom: '24px'
          }}>
            {message}
          </div>
        </div>

        <div className="card" style={{
          marginTop: '24px',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
            "Better luck next time. My operatives are everywhere."
          </p>
          <p style={{ marginTop: '8px', color: 'var(--accent)' }}>
            - Roberta Baron
          </p>
        </div>

        <p style={{ marginTop: '32px', color: 'var(--text-muted)' }}>
          The investigation continues another day...
        </p>

        {onPlayAgain && (
          <button
            className="btn btn-primary btn-large"
            onClick={onPlayAgain}
            style={{ marginTop: '32px' }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  )
}
