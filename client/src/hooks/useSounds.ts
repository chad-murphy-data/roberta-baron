import { useState, useCallback, useEffect } from 'react'
import { sounds, SoundName } from '../utils/sounds'

// Hook to use sounds with React state management
export function useSounds() {
  const [enabled, setEnabled] = useState(sounds.isEnabled())

  // Initialize sounds on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      sounds.init()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  const play = useCallback((name: SoundName) => {
    sounds.play(name)
  }, [])

  const toggle = useCallback(() => {
    const newState = sounds.toggle()
    setEnabled(newState)
    return newState
  }, [])

  return {
    play,
    toggle,
    enabled
  }
}

// Re-export for convenience
export type { SoundName }
