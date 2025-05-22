import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Home from './components/Home'
import ShareIdea from './components/ShareIdea'
import IdeasList from './components/IdeasList'
import Chatbox from './components/Chatbox'
import Navbar from './components/Navbar'
import Math from './components/subjects/Math'
import Physics from './components/subjects/Physics'
import Chemistry from './components/subjects/Chemistry'
import Biology from './components/subjects/Biology'
import EnvironmentalScience from './components/subjects/EnvironmentalScience'
import Courses from './components/Courses'
import './App.css'
import Game from './components/Game'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session); // Debug log
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session); // Debug log
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Debug log for current session
  console.log('Current session in App:', session);
  console.log('Current user in App:', session?.user);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error.message)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        {session && session.user && <Navbar user={session.user} />}
        <Routes>
          <Route
            path="/"
            element={session ? <Navigate to="/home" /> : <Auth />}
          />
          <Route
            path="/home"
            element={session ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/share-idea"
            element={session ? <ShareIdea /> : <Navigate to="/" />}
          />
          <Route
            path="/ideas"
            element={session ? <IdeasList /> : <Navigate to="/" />}
          />
          <Route
            path="/math"
            element={session ? <Math user={session.user} /> : <Navigate to="/" />}
          />
          <Route
            path="/physics"
            element={session ? <Physics user={session.user} /> : <Navigate to="/" />}
          />
          <Route
            path="/chemistry"
            element={session ? <Chemistry user={session.user} /> : <Navigate to="/" />}
          />
          <Route
            path="/biology"
            element={session ? <Biology user={session.user} /> : <Navigate to="/" />}
          />
          <Route
            path="/environmental-science"
            element={session ? <EnvironmentalScience user={session.user} /> : <Navigate to="/" />}
          />
          <Route
            path="/courses"
            element={session ? <Courses /> : <Navigate to="/" />}
          />
          <Route
            path="/game"
            element={session ? < Game /> : <Navigate to="/" />}
          />
        </Routes>
        {session && <Chatbox />}
      </div>
    </Router>
  )
}

export default App
