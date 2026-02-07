import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import KanbanBoard from '../components/KanbanBoard'
import './Projects.css'

function Projects({ projects, activeProjectId, setActiveProjectId, fetchProjects }) {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState('board')
  const [project, setProject] = useState(null)

  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      setActiveProjectId(projectId)
    }
  }, [projectId])

  useEffect(() => {
    const currentProject = projects.find(p => p.id === activeProjectId)
    setProject(currentProject)
  }, [activeProjectId, projects])

  const handleTaskAdd = async (columnId, title) => {
    try {
      const response = await fetch(`/api/projects/${activeProjectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status: columnId,
          priority: 'medium'
        })
      })
      
      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      
      if (response.ok) {
        await fetchProjects()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  if (!project) {
    return (
      <div className="projects-page">
        <div className="no-project-selected">
          <h2>Kein Projekt ausgewählt</h2>
          <p>Wähle ein Projekt aus der Seitenleiste aus</p>
        </div>
      </div>
    )
  }

  return (
    <div className="projects-page">
      <div className="project-header">
        <div className="project-header-info">
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
      </div>

      <div className="project-tabs">
        <button 
          className={`tab ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          📋 Board
        </button>
        <button 
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          📁 Files
        </button>
        <button 
          className={`tab ${activeTab === 'context' ? 'active' : ''}`}
          onClick={() => setActiveTab('context')}
        >
          📚 Context
        </button>
      </div>

      {activeTab === 'board' && (
        <KanbanBoard 
          project={project}
          onTaskAdd={handleTaskAdd}
          onTaskUpdate={handleTaskUpdate}
        />
      )}

      {activeTab === 'files' && (
        <div className="files-browser">
          <p>File Browser - Coming Soon</p>
        </div>
      )}

      {activeTab === 'context' && (
        <div className="context-view">
          <p>Context View - Coming Soon</p>
        </div>
      )}
    </div>
  )
}

export default Projects