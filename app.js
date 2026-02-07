const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
app.use(express.static(__dirname));

const dataFile = path.join(__dirname, 'tasks.json');
const agentStatusFile = path.join(__dirname, 'agent-status.json');

function readData() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { projects: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

// GET all projects
app.get('/api/projects', (req, res) => {
    const data = readData();
    res.json(data);
});

// POST new project
app.post('/api/projects', (req, res) => {
    const { name, description, docs } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Project name required' });
    }

    const data = readData();
    const newProject = {
        id: `proj-${uuidv4().slice(0, 8)}`,
        name,
        description: description || '',
        docs: docs || '# ' + name,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        tasks: [],
        createdAt: new Date().toISOString()
    };

    data.projects.push(newProject);
    writeData(data);

    console.log(`[PROJECT] Created: "${name}" (${newProject.id})`);
    res.status(201).json(newProject);
});

// PUT update project
app.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const data = readData();
    const projectIndex = data.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    data.projects[projectIndex] = { ...data.projects[projectIndex], ...updates };
    writeData(data);

    res.json(data.projects[projectIndex]);
});

// DELETE project
app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const projectIndex = data.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const removedProject = data.projects.splice(projectIndex, 1)[0];
    writeData(data);

    console.log(`[PROJECT] Deleted: "${removedProject.name}"`);
    res.json({ success: true });
});

// POST new task to project
app.post('/api/projects/:projectId/tasks', (req, res) => {
    const { projectId } = req.params;
    const { title, description, status, priority, date } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Title required' });
    }

    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const newTask = {
        id: uuidv4().slice(0, 8),
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
        date: date || new Date().toLocaleDateString('de-DE'),
        createdAt: new Date().toISOString()
    };

    project.tasks.push(newTask);
    writeData(data);

    console.log(`[TASK] Created: "${title}" in "${project.name}"`);
    res.status(201).json(newTask);
});

// PUT update task status
app.put('/api/projects/:projectId/tasks/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;
    const updates = req.body;

    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const taskIndex = project.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const oldStatus = project.tasks[taskIndex].status;
    project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...updates };
    writeData(data);

    if (updates.status && updates.status !== oldStatus) {
        console.log(`[TASK] "${project.tasks[taskIndex].title}": ${oldStatus} → ${updates.status}`);
    }

    res.json(project.tasks[taskIndex]);
});

// DELETE task
app.delete('/api/projects/:projectId/tasks/:taskId', (req, res) => {
    const { projectId, taskId } = req.params;

    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    const taskIndex = project.tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const removedTask = project.tasks.splice(taskIndex, 1)[0];
    writeData(data);

    console.log(`[TASK] Removed: "${removedTask.title}" from "${project.name}"`);
    res.json({ success: true });
});

// Status endpoint
app.get('/api/status', (req, res) => {
    const data = readData();
    const stats = {
        projects: data.projects.length,
        totalTasks: data.projects.reduce((sum, p) => sum + p.tasks.length, 0),
        tasksByStatus: {
            todo: 0,
            inProgress: 0,
            done: 0
        }
    };

    data.projects.forEach(p => {
        p.tasks.forEach(t => {
            if (t.status === 'todo') stats.tasksByStatus.todo++;
            if (t.status === 'in-progress') stats.tasksByStatus.inProgress++;
            if (t.status === 'done') stats.tasksByStatus.done++;
        });
    });

    res.json(stats);
});

// Molt Status - Queue
app.get('/api/molt-status', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const todoFile = path.join(__dirname, '..', 'MOLT_TODO.md');
        
        // Parse TODO file to extract tasks
        let queue = [];
        try {
            const content = fs.readFileSync(todoFile, 'utf8');
            const lines = content.split('\n');
            let section = null;
            
            lines.forEach(line => {
                if (line.includes('Completed')) section = 'completed';
                else if (line.includes('Next Up')) section = 'pending';
                else if (line.startsWith('- [x]')) {
                    queue.push({
                        title: line.replace('- [x] ', '').split('(')[0].trim(),
                        description: line.includes('(') ? line.split('(')[1].replace(')', '') : '',
                        status: 'completed',
                        completed: true
                    });
                } else if (line.startsWith('- [ ]')) {
                    queue.push({
                        title: line.replace('- [ ] ', '').split('(')[0].trim(),
                        description: line.includes('(') ? line.split('(')[1].replace(')', '') : '',
                        status: 'pending',
                        completed: false
                    });
                }
            });
        } catch (err) {
            queue = [];
        }

        res.json({ queue });
    } catch (error) {
        res.json({ queue: [] });
    }
});

// Activity Log
app.get('/api/activity', (req, res) => {
    try {
        const activityFile = path.join(__dirname, 'activity.json');
        const content = fs.readFileSync(activityFile, 'utf8');
        const data = JSON.parse(content);
        res.json(data);
    } catch (error) {
        res.json({ activities: [] });
    }
});

// Get agent status
app.get('/api/agent-status', (req, res) => {
    try {
        if (fs.existsSync(agentStatusFile)) {
            const data = JSON.parse(fs.readFileSync(agentStatusFile, 'utf8'));
            res.json(data);
        } else {
            res.json({ status: 'available', task: null, updatedAt: new Date().toISOString() });
        }
    } catch (error) {
        res.json({ status: 'available', task: null, updatedAt: new Date().toISOString() });
    }
});

// Update agent status
app.post('/api/agent-status', (req, res) => {
    try {
        const data = {
            status: req.body.status || 'available',
            task: req.body.task || null,
            updatedAt: new Date().toISOString()
        };
        fs.writeFileSync(agentStatusFile, JSON.stringify(data, null, 2));
        res.json({ success: true, ...data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new activity entry
app.post('/api/activity', (req, res) => {
    try {
        const activityFile = path.join(__dirname, 'activity.json');
        let data = { activities: [] };
        
        if (fs.existsSync(activityFile)) {
            data = JSON.parse(fs.readFileSync(activityFile, 'utf8'));
        }
        
        const newActivity = {
            id: String(Date.now()),
            timestamp: new Date().toISOString(),
            type: req.body.type || 'update',
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || 'completed',
            project: req.body.project || null
        };
        
        data.activities.push(newActivity);
        fs.writeFileSync(activityFile, JSON.stringify(data, null, 2));
        
        res.json({ success: true, activity: newActivity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get feature file content
app.get('/api/projects/:projectId/features/:featureId', (req, res) => {
    const { projectId, featureId } = req.params;
    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Projekt nicht gefunden' });
    }

    if (!project.projectPath) {
        return res.status(400).json({ error: 'Kein Projektpfad konfiguriert' });
    }

    try {
        const featuresPath = path.join(project.projectPath, 'features');
        const files = fs.readdirSync(featuresPath);
        const featureFile = files.find(f => f.startsWith(featureId) && f.endsWith('.md'));

        if (!featureFile) {
            return res.status(404).json({ error: 'Feature-Datei nicht gefunden' });
        }

        const filePath = path.join(featuresPath, featureFile);
        const content = fs.readFileSync(filePath, 'utf8');

        res.json({ 
            id: featureId,
            filename: featureFile,
            content: content,
            path: filePath
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update feature file content
app.put('/api/projects/:projectId/features/:featureId', (req, res) => {
    const { projectId, featureId } = req.params;
    const { content } = req.body;
    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Projekt nicht gefunden' });
    }

    if (!project.projectPath) {
        return res.status(400).json({ error: 'Kein Projektpfad konfiguriert' });
    }

    try {
        const featuresPath = path.join(project.projectPath, 'features');
        const files = fs.readdirSync(featuresPath);
        const featureFile = files.find(f => f.startsWith(featureId) && f.endsWith('.md'));

        if (!featureFile) {
            return res.status(404).json({ error: 'Feature-Datei nicht gefunden' });
        }

        const filePath = path.join(featuresPath, featureFile);
        fs.writeFileSync(filePath, content, 'utf8');

        // Update task title from first line
        const firstLine = content.split('\n')[0].replace(/^#+\s*/, '');
        const task = project.tasks.find(t => t.id === featureId);
        if (task && firstLine) {
            task.title = firstLine;
            writeData(data);
        }

        res.json({ 
            success: true,
            id: featureId,
            filename: featureFile,
            message: 'Feature aktualisiert'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync Features from Project
app.post('/api/projects/:projectId/sync-features', (req, res) => {
    const { projectId } = req.params;
    const data = readData();
    const project = data.projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    try {
        // Use stored projectPath or from request
        const projectPath = project.projectPath || req.body.projectPath;
        if (!projectPath) {
            return res.status(400).json({ error: 'projectPath required' });
        }

        const featuresPath = path.join(projectPath, 'features');
        
        if (!fs.existsSync(featuresPath)) {
            return res.json({ synced: 0, tasks: [] });
        }

        const files = fs.readdirSync(featuresPath);
        const featureFiles = files.filter(f => f.startsWith('PROJ-') && f.endsWith('.md'));

        let syncedCount = 0;
        const newTasks = [];

        featureFiles.forEach(file => {
            const filePath = path.join(featuresPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Extract feature name from file
            const match = file.match(/PROJ-(\d+)-(.+)\.md/);
            if (!match) return;

            const featureNum = match[1];
            const featureName = match[2].replace(/-/g, ' ');
            const firstLine = content.split('\n')[0].replace(/^#+\s*/, '');
            const title = firstLine || featureName;

            // Check if task already exists
            const existingTask = project.tasks.find(t => t.id === `PROJ-${featureNum}`);
            
            if (!existingTask) {
                const newTask = {
                    id: `PROJ-${featureNum}`,
                    title: title,
                    description: `Feature specification - Ready for Architecture`,
                    status: 'review',
                    priority: 'high',
                    date: new Date().toLocaleDateString('de-DE'),
                    featureFile: file,
                    createdAt: new Date().toISOString()
                };
                
                project.tasks.push(newTask);
                newTasks.push(newTask);
                syncedCount++;
            }
        });

        writeData(data);
        console.log(`[SYNC] ${syncedCount} features synced for project "${project.name}"`);
        
        res.json({ 
            synced: syncedCount, 
            tasks: newTasks,
            message: `${syncedCount} feature(s) synced successfully`
        });
    } catch (error) {
        console.error('Error syncing features:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// Context Files API (Agent Configuration)
// ==========================================

const WORKSPACE_PATH = path.join(__dirname, '..');
const CONTEXT_FILES = [
    { name: 'MEMORY.md', description: 'Langzeit-Gedächtnis & Notizen' },
    { name: 'AGENTS.md', description: 'Agent-Verhaltensregeln' },
    { name: 'SOUL.md', description: 'Persönlichkeit & Werte' },
    { name: 'USER.md', description: 'Infos über den User' },
    { name: 'TOOLS.md', description: 'Tool-Konfiguration & Notizen' },
    { name: 'IDENTITY.md', description: 'Name, Vibe, Avatar' },
    { name: 'HEARTBEAT.md', description: 'Periodische Aufgaben' },
    { name: 'docs/development.md', description: 'AI Coding Pipeline & Workflows' }
];

// GET all context files
app.get('/api/context-files', (req, res) => {
    const files = CONTEXT_FILES.map(file => {
        const filePath = path.join(WORKSPACE_PATH, file.name);
        let exists = false;
        let size = 0;
        let modifiedAt = null;
        
        try {
            const stats = fs.statSync(filePath);
            exists = true;
            size = stats.size;
            modifiedAt = stats.mtime.toISOString();
        } catch (err) {
            // File doesn't exist
        }
        
        return {
            ...file,
            exists,
            size,
            modifiedAt
        };
    });
    
    res.json({ files });
});

// GET single context file content
app.get('/api/context-files/:filename', (req, res) => {
    const { filename } = req.params;
    
    // Security: Only allow predefined files
    const allowed = CONTEXT_FILES.find(f => f.name === filename);
    if (!allowed) {
        return res.status(403).json({ error: 'Datei nicht erlaubt' });
    }
    
    const filePath = path.join(WORKSPACE_PATH, filename);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        
        res.json({
            name: filename,
            description: allowed.description,
            content,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString()
        });
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json({
                name: filename,
                description: allowed.description,
                content: '',
                exists: false
            });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// PUT update context file
app.put('/api/context-files/:filename', (req, res) => {
    const { filename } = req.params;
    const { content } = req.body;
    
    // Security: Only allow predefined files
    const allowed = CONTEXT_FILES.find(f => f.name === filename);
    if (!allowed) {
        return res.status(403).json({ error: 'Datei nicht erlaubt' });
    }
    
    if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content required' });
    }
    
    const filePath = path.join(WORKSPACE_PATH, filename);
    
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        const stats = fs.statSync(filePath);
        
        console.log(`[CONTEXT] Updated: ${filename}`);
        
        res.json({
            success: true,
            name: filename,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// File Browser API
// ==========================================

const IGNORED_DIRS = ['node_modules', '.git', '.next', 'dist', '.turbo', '__pycache__', '.cache', 'coverage'];
const IGNORED_FILES = ['.DS_Store', 'Thumbs.db'];

// Get file icon based on extension
function getFileIcon(filename) {
    const ext = path.extname(filename).toLowerCase();
    const icons = {
        '.ts': '🟦',
        '.tsx': '⚛️',
        '.js': '🟨',
        '.jsx': '⚛️',
        '.json': '📋',
        '.md': '📝',
        '.css': '🎨',
        '.scss': '🎨',
        '.html': '🌐',
        '.py': '🐍',
        '.yml': '⚙️',
        '.yaml': '⚙️',
        '.env': '🔒',
        '.gitignore': '📦',
        '.sh': '💻',
        '.sql': '🗃️',
        '.svg': '🖼️',
        '.png': '🖼️',
        '.jpg': '🖼️',
        '.jpeg': '🖼️'
    };
    return icons[ext] || '📄';
}

// Build directory tree recursively
function buildFileTree(dirPath, relativePath = '') {
    const items = [];
    
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            // Skip ignored directories and files
            if (IGNORED_DIRS.includes(entry.name) || IGNORED_FILES.includes(entry.name)) {
                continue;
            }
            
            const fullPath = path.join(dirPath, entry.name);
            const relPath = path.join(relativePath, entry.name);
            
            if (entry.isDirectory()) {
                const children = buildFileTree(fullPath, relPath);
                items.push({
                    name: entry.name,
                    path: relPath,
                    type: 'directory',
                    icon: '📁',
                    children: children
                });
            } else {
                const stats = fs.statSync(fullPath);
                items.push({
                    name: entry.name,
                    path: relPath,
                    type: 'file',
                    icon: getFileIcon(entry.name),
                    size: stats.size,
                    modifiedAt: stats.mtime.toISOString()
                });
            }
        }
        
        // Sort: directories first, then files, alphabetically
        items.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
    } catch (error) {
        console.error('Error reading directory:', error.message);
    }
    
    return items;
}

// GET file tree for project
app.get('/api/projects/:id/files', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const project = data.projects.find(p => p.id === id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.projectPath) {
        return res.status(400).json({ error: 'No project path configured', needsPath: true });
    }

    if (!fs.existsSync(project.projectPath)) {
        return res.status(404).json({ error: 'Project path does not exist', path: project.projectPath });
    }

    try {
        const tree = buildFileTree(project.projectPath);
        res.json({
            projectPath: project.projectPath,
            tree: tree
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET file content
app.get('/api/projects/:id/files/*', (req, res) => {
    const { id } = req.params;
    const filePath = req.params[0]; // Everything after /files/
    
    const data = readData();
    const project = data.projects.find(p => p.id === id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.projectPath) {
        return res.status(400).json({ error: 'No project path configured' });
    }

    const fullPath = path.join(project.projectPath, filePath);
    
    // Security: Ensure the path is within the project directory
    const normalizedProject = path.resolve(project.projectPath);
    const normalizedFile = path.resolve(fullPath);
    
    if (!normalizedFile.startsWith(normalizedProject)) {
        return res.status(403).json({ error: 'Access denied: Path traversal detected' });
    }

    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            return res.status(400).json({ error: 'Path is a directory' });
        }
        
        // Check file size (limit to 1MB for text files)
        if (stats.size > 1024 * 1024) {
            return res.status(413).json({ error: 'File too large (max 1MB)' });
        }
        
        const content = fs.readFileSync(fullPath, 'utf8');
        const ext = path.extname(filePath).toLowerCase();
        
        res.json({
            path: filePath,
            name: path.basename(filePath),
            content: content,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString(),
            extension: ext,
            icon: getFileIcon(path.basename(filePath))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT save file content
app.put('/api/projects/:id/files/*', (req, res) => {
    const { id } = req.params;
    const filePath = req.params[0];
    const { content } = req.body;
    
    const data = readData();
    const project = data.projects.find(p => p.id === id);

    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.projectPath) {
        return res.status(400).json({ error: 'No project path configured' });
    }

    if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content required' });
    }

    const fullPath = path.join(project.projectPath, filePath);
    
    // Security: Ensure the path is within the project directory
    const normalizedProject = path.resolve(project.projectPath);
    const normalizedFile = path.resolve(fullPath);
    
    if (!normalizedFile.startsWith(normalizedProject)) {
        return res.status(403).json({ error: 'Access denied: Path traversal detected' });
    }

    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        const stats = fs.statSync(fullPath);
        
        console.log(`[FILE] Saved: ${filePath} in project "${project.name}"`);
        
        res.json({
            success: true,
            path: filePath,
            size: stats.size,
            modifiedAt: stats.mtime.toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`\n🦞 Molt's Multi-Project Board v2\n`);
    console.log(`   🌐 http://0.0.0.0:${PORT}`);
    console.log(`   📡 API: http://localhost:${PORT}/api/projects\n`);
});
