import { useState, useEffect, ReactNode } from 'react'
import { getPilotImage, PilotPose } from '../utils/assets'

interface TypingTextProps {
  text: string
  speed?: number // ms per character
  onComplete?: () => void
}

// Typing animation component
export function TypingText({ text, speed = 30, onComplete }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setIsComplete(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayed}
      {!isComplete && <span className="typing-cursor">|</span>}
    </span>
  )
}

interface PilotProps {
  pose?: PilotPose
  message?: string
  typingSpeed?: number // ms per character, 0 to disable typing
  children?: ReactNode // For buttons/options below speech bubble
  size?: 'small' | 'medium' | 'large'
  animate?: boolean
  onMessageComplete?: () => void
}

export default function Pilot({
  pose = 'hi',
  message,
  typingSpeed = 30,
  children,
  size = 'medium',
  animate = true,
  onMessageComplete
}: PilotProps) {
  const [showFullMessage, setShowFullMessage] = useState(typingSpeed === 0)

  // Reset typing state when message changes
  useEffect(() => {
    setShowFullMessage(typingSpeed === 0)
  }, [message, typingSpeed])

  const handleClick = () => {
    // Skip typing animation on click
    if (!showFullMessage && message) {
      setShowFullMessage(true)
      onMessageComplete?.()
    }
  }

  const sizeStyles = {
    small: { width: 80, height: 100 },
    medium: { width: 120, height: 150 },
    large: { width: 180, height: 225 }
  }

  const { width, height } = sizeStyles[size]

  return (
    <div className="pilot-container" onClick={handleClick}>
      {/* Pilot Image */}
      <div
        className={`pilot-image ${animate ? 'pilot-animate' : ''}`}
        style={{
          width,
          height,
          position: 'relative'
        }}
      >
        <img
          src={getPilotImage(pose)}
          alt="Pilot"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        {/* Glow effect */}
        {animate && (
          <div className="pilot-glow" />
        )}
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="speech-bubble">
          <div className="speech-bubble-content">
            {showFullMessage ? (
              <span>{message}</span>
            ) : (
              <TypingText
                text={message}
                speed={typingSpeed}
                onComplete={() => {
                  setShowFullMessage(true)
                  onMessageComplete?.()
                }}
              />
            )}
          </div>
          <div className="speech-bubble-tail" />
        </div>
      )}

      {/* Options/Children below speech bubble */}
      {children && (
        <div className="pilot-options">
          {children}
        </div>
      )}

      {/* Click to skip hint */}
      {message && !showFullMessage && (
        <div className="pilot-skip-hint">
          Click to skip
        </div>
      )}
    </div>
  )
}

// Compact inline pilot for status messages
interface PilotInlineProps {
  pose?: PilotPose
  message: string
  size?: number // Image size in px
}

export function PilotInline({ pose = 'hi', message, size = 40 }: PilotInlineProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <img
        src={getPilotImage(pose)}
        alt="Pilot"
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  )
}
