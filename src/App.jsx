import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home.jsx'
import Dashboard from './Components/Dashboard'
import ReportedIssues from './Components/ReportedIssues.jsx'
import ResolvedIssues from './Components/ResolvedIssues.jsx'
import Leaderboard from './Components/Leaderboard.jsx'
import Profile from './Components/Profile.jsx'

const App = () => {
  return (
    <div className='w-screen h-screen flex bg-[#F0EEFF]'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reported-issues" element={<ReportedIssues />} />
      <Route path="/resolved-issues" element={<ResolvedIssues />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="profile" element={<Profile/>}/>
    </Routes>
    </div>
  )
}

export default App