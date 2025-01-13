import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Chat from './components/Chat'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Router>
  )
}

export default App
