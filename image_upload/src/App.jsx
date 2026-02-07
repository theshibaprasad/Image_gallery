import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CreatePost from './pages/CreatePost.jsx'
import Feed from './pages/Feed.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <nav className="navbar">
        <div className="nav-brand">Image Gallery</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/createpost" className="nav-link">Create Post</Link>
          <Link to="/feed" className="nav-link">Feed</Link>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<Feed />} />
        <Route path='/createpost' element={<CreatePost />} />
        <Route path='/feed' element={<Feed />} />
      </Routes>
    </Router>
  )
}

export default App
