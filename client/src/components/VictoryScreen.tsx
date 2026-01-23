import { useEffect, useState } from 'react'

interface VictoryScreenProps {
  message: string
  criminalName: string
}

export default function VictoryScreen({ message, criminalName }: VictoryScreenProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([])

  useEffect(() => {
    // Generate confetti
    const colors = ['#ffd700', '#e94560', '#4ade80', '#60a5fa', '#f472b6']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setConfetti(newConfetti)
  }, [])

  return (
    <div className="victory-screen">
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            background: piece.color
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '40px',
        maxWidth: '600px'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎉</div>

        <h1 className="pixel-font" style={{
          fontSize: '2rem',
          color: 'var(--gold)',
          marginBottom: '24px'
        }}>
          CASE CLOSED!
        </h1>

        <div className="card" style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '2px solid var(--gold)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'var(--accent)',
            margin: '0 auto 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            👮
          </div>

          <h2 style={{ marginBottom: '16px' }}>{criminalName}</h2>

          <p style={{ color: 'var(--success)', marginBottom: '24px' }}>
            HAS BEEN APPREHENDED
          </p>

          <div style={{
            whiteSpace: 'pre-line',
            color: 'var(--text-muted)',
            lineHeight: 1.8
          }}>
            {message}
          </div>
        </div>

        <p style={{ marginTop: '32px', color: 'var(--text-muted)' }}>
          Roberta Baron's network grows weaker. Well done, team!
        </p>
      </div>
    </div>
  )
}
