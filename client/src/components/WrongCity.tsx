import Pilot from './Pilot'
import { CityImage } from '../utils/assets'

interface WrongCityProps {
  wrongCityName: string
  deadEndMessage: string
  hoursRemaining: number
  onFlyBack: () => void
}

export default function WrongCity({ wrongCityName, deadEndMessage, hoursRemaining, onFlyBack }: WrongCityProps) {
  return (
    <div className="centered" style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Worried Pilot */}
        <div className="pilot-worried">
          <Pilot
            pose="worried"
            message={`Oh no! ${wrongCityName} is a dead end. We need to fly back!`}
            typingSpeed={25}
            size="medium"
          />
        </div>

        <h1 style={{ fontSize: '2rem', marginTop: '24px', marginBottom: '16px', color: 'var(--warning)' }}>
          Wrong Destination!
        </h1>

        {/* City image */}
        <div style={{
          width: '200px',
          height: '120px',
          margin: '0 auto 24px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid var(--warning)',
          opacity: 0.7
        }}>
          <CityImage
            cityName={wrongCityName}
            showOverlay={true}
          />
        </div>

        <div className="card" style={{
          background: 'rgba(0, 0, 0, 0.3)',
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
