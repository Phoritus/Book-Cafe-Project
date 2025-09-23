import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Navbar from './components/Navbar.jsx';
import EditProfile from './components/EditProfile.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
