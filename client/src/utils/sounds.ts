// Sound names used throughout the game
export type SoundName =
  | 'vote-submit'
  | 'vote-reveal'
  | 'correct-city'
  | 'wrong-city'
  | 'clue-discovered'
  | 'clue-shared'
  | 'flight-takeoff'
  | 'flight-landing'
  | 'clock-tick'
  | 'clock-warning'
  | 'victory'
  | 'defeat'
  | 'game-start'
  // Mind Meld sounds
  | 'mind-meld-start'
  | 'mind-meld-submit'
  | 'mind-meld-match'
  | 'mind-meld-big-match'
  | 'mind-meld-bonus'
  | 'mind-meld-no-match'

const ALL_SOUNDS: SoundName[] = [
  'vote-submit',
  'vote-reveal',
  'correct-city',
  'wrong-city',
  'clue-discovered',
  'clue-shared',
  'flight-takeoff',
  'flight-landing',
  'clock-tick',
  'clock-warning',
  'victory',
  'defeat',
  'game-start',
  // Mind Meld sounds
  'mind-meld-start',
  'mind-meld-submit',
  'mind-meld-match',
  'mind-meld-big-match',
  'mind-meld-bonus',
  'mind-meld-no-match'
]

class SoundManager {
  private sounds: Map<SoundName, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private volume: number = 0.5
  private initialized: boolean = false

  constructor() {
    // Don't preload in constructor - wait for user interaction
  }

  // Initialize sounds (call after first user interaction to avoid autoplay issues)
  init() {
    if (this.initialized) return
    this.initialized = true

    ALL_SOUNDS.forEach(name => {
      const audio = new Audio()
      audio.volume = this.volume

      // Try to load the real sound file
      audio.src = `/assets/sounds/${name}.mp3`

      // On error, fall back to placeholder (silent)
      audio.onerror = () => {
        audio.src = '/assets/sounds/placeholder.mp3'
      }

      // Preload
      audio.load()

      this.sounds.set(name, audio)
    })
  }

  play(name: SoundName) {
    if (!this.enabled) return

    // Initialize on first play attempt
    if (!this.initialized) {
      this.init()
    }

    const sound = this.sounds.get(name)
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement
      clone.volume = this.volume
      clone.play().catch(() => {
        // Autoplay blocked - silently ignore
        // This happens before user interaction
      })
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
    this.sounds.forEach(audio => {
      audio.volume = this.volume
    })
  }

  getVolume(): number {
    return this.volume
  }
}

// Singleton instance
export const sounds = new SoundManager()
