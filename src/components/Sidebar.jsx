import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ projects, activeProjectId, setActiveProjectId }) {
  const [agentStatus, setAgentStatus] = useState({ status: 'available', text: 'Verfügbar' })
  const [projectsExpanded, setProjectsExpanded] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/agent-status')
      const data = await response.json()
      setAgentStatus(data)
    } catch (error) {
      console.error('Error fetching agent status:', error)
    }
  }

  const handleProjectClick = (projectId) => {
    setActiveProjectId(projectId)
    localStorage.setItem('lastProjectId', projectId)
    navigate(`/projects/${projectId}`)
  }

  const isActiveTab = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">🦞 Molt's Kanban</div>
      
      <div className="agent-status">
        <div className={`agent-status-dot ${agentStatus.status}`}></div>
        <span className="agent-status-text">{agentStatus.text}</span>
      </div>
      
      <nav className="nav-menu">
        <Link to="/" className={`nav-item ${isActiveTab('/') ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Dashboard</span>
        </Link>
        
        <div 
          className={`nav-item ${isActiveTab('/projects') ? 'active' : ''}`}
          onClick={() => setProjectsExpanded(!projectsExpanded)}
        >
          <span className="nav-icon">📁</span>
          <span className="nav-label">Projekte</span>
        </div>
        
        {projectsExpanded && (
          <div className="nav-submenu">
            <div className="projects-list">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${activeProjectId === project.id ? 'active' : ''}`}
                  onClick={() => handleProjectClick(project.id)}
                  style={{ borderLeftColor: project.color }}
                >
                  <div className="project-id">{project.id}</div>
                  <div className="project-name">{project.name}</div>
                </div>
              ))}
            </div>
            <button className="add-project-btn">
              + Neues Projekt
            </button>
          </div>
        )}
        
        <Link to="/activities" className={`nav-item ${isActiveTab('/activities') ? 'active' : ''}`}>
          <span className="nav-icon">📜</span>
          <span className="nav-label">Aktivitäten</span>
        </Link>
        
        <Link to="/context" className={`nav-item ${isActiveTab('/context') ? 'active' : ''}`}>
          <span className="nav-icon">🧠</span>
          <span className="nav-label">Context-Speicher</span>
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar