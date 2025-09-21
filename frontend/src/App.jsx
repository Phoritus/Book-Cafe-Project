import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Router>
        <div className="min-h-screen bg-cream-50">
          <Navbar />
          <main className="flex-1">
            <Routes>

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </div>
  )
}

export default App
