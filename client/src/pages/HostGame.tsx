import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePartyKit } from '../context/PartyKitContext'
import { useSounds } from '../hooks/useSounds'
import Lobby from '../components/Lobby'
import IntroScreen from '../components/IntroScreen'
import GameBoard from '../components/GameBoard'
import VotingDisplay from '../components/VotingDisplay'
import VictoryScreen from '../components/VictoryScreen'
import DefeatScreen from '../components/DefeatScreen'
import WrongCity from '../components/WrongCity'
import NewsTicker from '../components/NewsTicker'
import MindMeldHost from '../components/MindMeldHost'
import PopularityHost from '../components/PopularityHost'
import HighLowHost from '../components/HighLowHost'

export default function HostGame() {
  const { roomCode: urlRoomCode } = useParams()
  const navigate = useNavigate()
  const {
    isConnected,
    roomCode,
    players,
    isHost,
    gameState,
    votingState,
    mindMeldState,
    popularityState,
    highLowState,
    startGame,
    proceedFromIntro,
    searchLocation,
    startVote,
    submitVote,
    flyBack,
    error
  } = usePartyKit()

  const [newsHeadline, setNewsHeadline] = useState<string>('')
  const { play, toggle, enabled: soundEnabled } = useSounds()

  // Track previous game state for sound triggers
  const prevGamePhase = useRef(gameState?.gamePhase)
  const prevVotingState = useRef(votingState)

  // Play sounds based on game events
  useEffect(() => {
    if (!gameState) return

    // Game phase changes
    if (prevGamePhase.current !== gameState.gamePhase) {
      if (gameState.gamePhase === 'victory') {
        play('victory')
      } else if (gameState.gamePhase === 'defeat') {
        play('defeat')
      } else if (gameState.gamePhase === 'wrongCity') {
        play('wrong-city')
      } else if (prevGamePhase.current === 'intro' && gameState.gamePhase === 'searching') {
        play('game-start')
      }
      prevGamePhase.current = gameState.gamePhase
    }
  }, [gameState?.gamePhase, play])

  // Vote result sounds
  useEffect(() => {
    if (votingState?.winner && !prevVotingState.current?.winner) {
      play('vote-reveal')
    }
    prevVotingState.current = votingState
  }, [votingState, play])

  // Redirect if not in the right room
  useEffect(() => {
    if (!isConnected) return
    if (roomCode && roomCode !== urlRoomCode) {
      navigate(`/host/${roomCode}`)
    }
  }, [roomCode, urlRoomCode, isConnected, navigate])

  // Generate news headlines periodically
  useEffect(() => {
    if (gameState?.currentCompany) {
      const generateHeadline = () => {
        const headlines = [
          `BREAKING: ${gameState.currentCompany.name} reports Q3 earnings down after mysterious theft of '${gameState.currentCompany.stolenAsset}'`,
          `Analysts puzzled as ${gameState.currentCompany.name}'s '${gameState.currentCompany.stolenAsset}' vanishes from quarterly report`,
          `Employees at ${gameState.currentCompany.name} report 'something feels different' but can't explain`,
          `Industry experts baffled: ${gameState.currentCompany.name}'s '${gameState.currentCompany.stolenAsset}' nowhere to be found`,
          `Intern at ${gameState.currentCompany.name}: 'The vibes are just... off now'`
        ]
        setNewsHeadline(headlines[Math.floor(Math.random() * headlines.length)])
      }

      generateHeadline()
      const interval = setInterval(generateHeadline, 15000)
      return () => clearInterval(interval)
    }
  }, [gameState?.currentCompany])

  if (!isConnected) {
    return (
      <div className="centered">
        <p>Connecting to server...</p>
      </div>
    )
  }

  // Lobby - waiting for players
  if (!gameState || gameState.gamePhase === 'lobby') {
    return (
      <Lobby
        roomCode={urlRoomCode || ''}
        players={players}
        isHost={isHost}
        onStartGame={startGame}
        error={error}
      />
    )
  }

  // Intro screen
  if (gameState.gamePhase === 'intro') {
    return (
      <IntroScreen
        robertaQuote={gameState.robertaQuote || ''}
        firstCompany={gameState.currentCompany}
        onContinue={proceedFromIntro}
      />
    )
  }

  const handlePlayAgain = () => {
    navigate('/')
  }

  // Victory screen
  if (gameState.gamePhase === 'victory') {
    return (
      <VictoryScreen
        message={gameState.victoryMessage || 'You won!'}
        criminalName={gameState.criminalName || 'Unknown'}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  // Defeat screen
  if (gameState.gamePhase === 'defeat') {
    return (
      <DefeatScreen
        message={gameState.defeatMessage || 'Game over!'}
        onPlayAgain={handlePlayAgain}
      />
    )
  }

  // Wrong city screen
  if (gameState.gamePhase === 'wrongCity') {
    return (
      <WrongCity
        wrongCityName={gameState.wrongCityName || 'Unknown'}
        deadEndMessage={gameState.deadEndMessage || "The trail has gone cold here."}
        hoursRemaining={gameState.hoursRemaining}
        onFlyBack={flyBack}
      />
    )
  }

  // Mini-games during travel
  if (gameState.gamePhase === 'miniGame') {
    // Mind Meld
    if (gameState.activeMiniGame === 'mind_meld' && mindMeldState) {
      return (
        <MindMeldHost
          mindMeldState={mindMeldState}
          players={players}
        />
      )
    }

    // Which is More Popular
    if (gameState.activeMiniGame === 'popularity' && popularityState) {
      return (
        <PopularityHost
          popularityState={popularityState}
          players={players}
        />
      )
    }

    // High-Low
    if (gameState.activeMiniGame === 'high_low' && highLowState) {
      return (
        <HighLowHost
          highLowState={highLowState}
          players={players}
        />
      )
    }
  }

  // Main game board
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 className="pixel-font" style={{ fontSize: '1rem', color: 'var(--gold)' }}>
            All hands on deck
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Room: {urlRoomCode}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className={`timer ${gameState.hoursRemaining <= 10 ? 'danger' : gameState.hoursRemaining <= 20 ? 'warning' : ''}`}>
            {gameState.hoursRemaining} hours remaining
          </div>
          <button
            onClick={toggle}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text)'
            }}
            title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      {/* News ticker */}
      <NewsTicker headline={newsHeadline} />

      {/* Main content */}
      <main style={{ flex: 1, padding: '24px' }}>
        {votingState ? (
          <VotingDisplay
            votingState={votingState}
            players={players}
            isHost={true}
            onVote={submitVote}
          />
        ) : (
          <GameBoard
            gameState={gameState}
            onSearch={searchLocation}
            onStartVote={startVote}
            isHost={true}
          />
        )}
      </main>

      {/* Footer with player count */}
      <footer style={{
        padding: '12px 24px',
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="player-list">
          {players.map(player => (
            <span key={player.id} className={`player-badge ${player.isHost ? 'host' : ''}`}>
              {player.isHost && <span className="host-icon">★</span>}
              {player.name}
            </span>
          ))}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          City {gameState.currentCityIndex + 1} of {gameState.totalCities}
        </div>
      </footer>
    </div>
  )
}
