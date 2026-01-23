import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useGame } from '../context/GameContext'
import Lobby from '../components/Lobby'
import IntroScreen from '../components/IntroScreen'
import GameBoard from '../components/GameBoard'
import VotingDisplay from '../components/VotingDisplay'
import VictoryScreen from '../components/VictoryScreen'
import DefeatScreen from '../components/DefeatScreen'
import NewsTicker from '../components/NewsTicker'

export default function HostGame() {
  const { roomCode: urlRoomCode } = useParams()
  const navigate = useNavigate()
  const { isConnected } = useSocket()
  const {
    roomCode,
    players,
    isHost,
    gameState,
    votingState,
    startGame,
    proceedFromIntro,
    searchLocation,
    startVote,
    error
  } = useGame()

  const [newsHeadline, setNewsHeadline] = useState<string>('')

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

  // Victory screen
  if (gameState.gamePhase === 'victory') {
    return (
      <VictoryScreen
        message={gameState.victoryMessage || 'You won!'}
        criminalName={gameState.criminalName || 'Unknown'}
      />
    )
  }

  // Defeat screen
  if (gameState.gamePhase === 'defeat') {
    return (
      <DefeatScreen
        message={gameState.defeatMessage || 'Game over!'}
      />
    )
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
            ALL HANDS ON DECK
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Room: {urlRoomCode}
          </p>
        </div>

        <div className={`timer ${gameState.hoursRemaining <= 10 ? 'danger' : gameState.hoursRemaining <= 20 ? 'warning' : ''}`}>
          {gameState.hoursRemaining} hours remaining
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
