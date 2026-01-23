import { Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import HostGame from './pages/HostGame'
import PlayerGame from './pages/PlayerGame'

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/host/:roomCode" element={<HostGame />} />
            <Route path="/play/:roomCode" element={<PlayerGame />} />
          </Routes>
        </div>
      </GameProvider>
    </SocketProvider>
  )
}

export default App
