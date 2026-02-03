import { useState, useEffect } from 'react'
import { AssetImage, getRobertaBaronImage, CityImage } from '../utils/assets'
import Pilot from './Pilot'

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
          {/* Wanted Poster style for Roberta */}
          <div className="wanted-poster" style={{ maxWidth: '300px', margin: '0 auto 32px' }}>
            <div style={{
              width: '120px',
              height: '150px',
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <AssetImage
                src={getRobertaBaronImage()}
                alt="Roberta Baron"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3>ROBERTA BARON</h3>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Corporate Espionage Mastermind</p>
          </div>

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
            width: '200px',
            height: '120px',
            margin: '0 auto 24px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid var(--border)'
          }}>
            <CityImage
              cityName={firstCompany.city}
              companyName={firstCompany.name}
              alt={`${firstCompany.city}, ${firstCompany.state}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

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

  // Mission briefing with Pilot
  return (
    <div className="centered" style={{ padding: '40px' }}>
      <div style={{ maxWidth: '700px' }}>
        <h1 className="pixel-font" style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: '24px' }}>
          YOUR MISSION
        </h1>

        <Pilot
          pose="pointing"
          message={`We've got a case! Someone stole "${firstCompany.stolenAsset}" from ${firstCompany.name}. You have 39 hours to track down the operative and make the arrest!`}
          typingSpeed={20}
          size="medium"
        />

        <div className="card" style={{ marginTop: '24px', marginBottom: '32px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Your objectives:
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
