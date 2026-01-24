interface WrongCityProps {
  wrongCityName: string
  deadEndMessage: string
  hoursRemaining: number
  onFlyBack: () => void
}

export default function WrongCity({ wrongCityName, deadEndMessage, hoursRemaining, onFlyBack }: WrongCityProps) {
  return (
    <div className="centered" style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' }}>
      <div className="card" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--warning)' }}>
          Wrong Destination!
        </h1>

        <p style={{ fontSize: '1.25rem', marginBottom: '24px' }}>
          You traveled to <span style={{ color: 'var(--gold)' }}>{wrongCityName}</span>
        </p>

        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontStyle: 'italic'
        }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            "{deadEndMessage}"
          </p>
        </div>

        <p style={{ color: 'var(--error)', marginBottom: '24px' }}>
          Time wasted! You'll need to fly back.
        </p>

        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Flying back will cost another 4-5 hours...
        </p>

        <button
          className="btn btn-primary btn-large"
          onClick={onFlyBack}
          style={{ minWidth: '200px' }}
        >
          Fly Back (4-5 hrs)
        </button>

        <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {hoursRemaining} hours remaining
          </p>
        </div>
      </div>
    </div>
  )
}
