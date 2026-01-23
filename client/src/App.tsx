import { Routes, Route } from 'react-router-dom'
import { PartyKitProvider } from './context/PartyKitContext'
import Home from './pages/Home'
import HostGame from './pages/HostGame'
import PlayerGame from './pages/PlayerGame'

function App() {
  return (
    <PartyKitProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host/:roomCode" element={<HostGame />} />
          <Route path="/play/:roomCode" element={<PlayerGame />} />
        </Routes>
      </div>
    </PartyKitProvider>
  )
}

export default App
