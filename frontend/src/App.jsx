import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Navbar from './components/Navbar.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Router>
        <Navbar />
      </Router>
    </div>
  )
}

export default App
