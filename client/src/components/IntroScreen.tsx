import { useState, useEffect } from 'react'

interface CurrentCompany {
  name: string
  city: string
  state: string
  stolenAsset: string
}

interface IntroScreenProps {
  robertaQuote: string
  firstCompany: CurrentCompany
  onContinue: () => void
}

export default function IntroScreen({ robertaQuote, firstCompany, onContinue }: IntroScreenProps) {
  const [phase, setPhase] = useState<'quote' | 'news' | 'mission'>('quote')

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('news'), 5000)
    const timer2 = setTimeout(() => setPhase('mission'), 10000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (phase === 'quote') {
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--gold) 100%)',
            margin: '0 auto 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem'
          }}>
            🕵️
          </div>

          <h2 style={{ marginBottom: '24px', color: 'var(--accent)' }}>
            ROBERTA BARON
          </h2>

          <div className="card" style={{ textAlign: 'left' }}>
            <p style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.6 }}>
              "{robertaQuote}"
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'news') {
    return (
      <div className="centered" style={{ padding: '40px' }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{
            background: 'var(--accent)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'inline-block',
            marginBottom: '24px',
            fontWeight: 'bold'
          }}>
            BREAKING NEWS
          </div>

          <h2 style={{ marginBottom: '16px' }}>
            {firstCompany.name} Reports Mysterious Theft
          </h2>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            {firstCompany.city}, {firstCompany.state}
          </p>

          <div className="card">
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              In an unprecedented corporate incident, <strong>{firstCompany.name}</strong> has
              reported the theft of their <strong>"{firstCompany.stolenAsset}"</strong>.
              Authorities are baffled as no physical evidence was left behind.
            </p>
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
              "It's like someone walked out with our entire corporate identity," said one anonymous executive.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="centered" style={{ padding: '40px' }}>
      <div style={{ maxWidth: '700px' }}>
        <h1 className="pixel-font" style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '24px' }}>
          YOUR MISSION
        </h1>

        <div className="card" style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '16px' }}>
            Track down the operative responsible for stealing{' '}
            <strong style={{ color: 'var(--accent) ' }}>"{firstCompany.stolenAsset}"</strong>{' '}
            from {firstCompany.name}.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            You have <strong style={{ color: 'var(--gold)' }}>39 hours</strong> to:
          </p>
          <ul style={{ marginTop: '16px', marginLeft: '24px', lineHeight: 2 }}>
            <li>Search locations for clues</li>
            <li>Identify the criminal</li>
            <li>Track them to their final destination</li>
            <li>Make the arrest!</li>
          </ul>
        </div>

        <div style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>
          <p>Your investigation begins at:</p>
          <p style={{ fontSize: '1.5rem', color: 'var(--text)', marginTop: '8px' }}>
            {firstCompany.name} HQ - {firstCompany.city}, {firstCompany.state}
          </p>
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={onContinue}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          Begin Investigation
        </button>
      </div>
    </div>
  )
}
