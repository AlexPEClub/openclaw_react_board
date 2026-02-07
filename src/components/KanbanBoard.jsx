import React, { useState } from 'react'
import './KanbanBoard.css'

const columns = [
  { id: 'todo', title: 'Offen', icon: '📋' },
  { id: 'in-progress', title: 'In Arbeit', icon: '⚡' },
  { id: 'review', title: 'Review', icon: '👀' },
  { id: 'done', title: 'Erledigt', icon: '✅' }
]

function KanbanBoard({ project, onTaskUpdate, onTaskAdd }) {
  const [newTaskInputs, setNewTaskInputs] = useState({})

  if (!project) {
    return <div className="empty-board">Kein Projekt ausgewählt</div>
  }

  const handleAddTask = async (columnId) => {
    const title = newTaskInputs[columnId]?.trim()
    if (!title) return

    await onTaskAdd(columnId, title)
    setNewTaskInputs({ ...newTaskInputs, [columnId]: '' })
  }

  const handleInputChange = (columnId, value) => {
    setNewTaskInputs({ ...newTaskInputs, [columnId]: value })
  }

  const handleKeyPress = (e, columnId) => {
    if (e.key === 'Enter') {
      handleAddTask(columnId)
    }
  }

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('task', JSON.stringify(task))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault()
    const task = JSON.parse(e.dataTransfer.getData('task'))
    if (task.status !== targetColumnId) {
      await onTaskUpdate(task.id, { status: targetColumnId })
    }
  }

  return (
    <div className="kanban-board">
      {columns.map(column => {
        const columnTasks = project.tasks?.filter(task => task.status === column.id) || []
        
        return (
          <div 
            key={column.id} 
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <span className="column-icon">{column.icon}</span>
              <span className="column-title">{column.title}</span>
              <span className="task-count">{columnTasks.length}</span>
            </div>
            
            <div className="tasks-list">
              {columnTasks.length === 0 ? (
                <div className="empty-state">Keine Aufgaben</div>
              ) : (
                columnTasks.map(task => (
                  <div 
                    key={task.id}
                    className={`task-card ${task.featureFile ? 'has-feature' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                  >
                    <div className="task-title">{task.title}</div>
                    {task.description && (
                      <div className="task-description">{task.description}</div>
                    )}
                    <div className="task-meta">
                      {task.priority && (
                        <span className={`task-priority priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      )}
                      {task.featureFile && (
                        <span className="task-feature">
                          📄 {task.featureFile}
                        </span>
                      )}
                      {task.date && <span className="task-date">{task.date}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="add-task-input">
              <input
                type="text"
                placeholder="Aufgabe hinzufügen..."
                className="task-input"
                value={newTaskInputs[column.id] || ''}
                onChange={(e) => handleInputChange(column.id, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, column.id)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default KanbanBoard