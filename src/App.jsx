import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Activities from './pages/Activities'
import ContextFiles from './pages/ContextFiles'
import './styles/App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data.projects || data)
      
      // Restore last active project
      const lastProjectId = localStorage.getItem('lastProjectId')
      if (lastProjectId && data.projects?.some(p => p.id === lastProjectId)) {
        setActiveProjectId(lastProjectId)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <Sidebar 
        projects={projects}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
      />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard projects={projects} />} />
          <Route 
            path="/projects/:projectId?" 
            element={
              <Projects 
                projects={projects}
                activeProjectId={activeProjectId}
                setActiveProjectId={setActiveProjectId}
                fetchProjects={fetchProjects}
              />
            } 
          />
          <Route path="/activities" element={<Activities />} />
          <Route path="/context" element={<ContextFiles />} />
        </Routes>
      </main>
    </div>
  )
}

export default App