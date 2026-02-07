#!/usr/bin/env node

// Script to update existing projects with correct projectPath

const fs = require('fs');
const path = require('path');

const tasksFile = path.join(__dirname, 'tasks.json');

console.log('🦞 Updating project paths...\n');

try {
    // Read current tasks
    const data = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
    
    // Common project paths
    const projectsRoot = '/home/node/clawd/projects';
    
    // Update each project
    data.projects = data.projects.map(project => {
        if (!project.projectPath) {
            // Try to guess project path based on name
            const folderName = project.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');
            
            const guessedPath = path.join(projectsRoot, folderName);
            
            console.log(`Project: ${project.name}`);
            console.log(`  ID: ${project.id}`);
            console.log(`  Guessed path: ${guessedPath}`);
            
            // Check if path exists
            if (fs.existsSync(guessedPath)) {
                project.projectPath = guessedPath;
                console.log(`  ✅ Path exists - Updated!\n`);
            } else {
                // Try some variations
                const variations = [
                    folderName,
                    project.name.toLowerCase().replace(/\s+/g, '_'),
                    project.id
                ];
                
                let found = false;
                for (const variant of variations) {
                    const variantPath = path.join(projectsRoot, variant);
                    if (fs.existsSync(variantPath)) {
                        project.projectPath = variantPath;
                        console.log(`  ✅ Found at: ${variantPath}\n`);
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    console.log(`  ❌ Path not found - Please set manually\n`);
                    
                    // Create the directory?
                    console.log(`  Creating directory: ${guessedPath}`);
                    fs.mkdirSync(guessedPath, { recursive: true });
                    fs.mkdirSync(path.join(guessedPath, 'specs'), { recursive: true });
                    fs.mkdirSync(path.join(guessedPath, 'docs'), { recursive: true });
                    fs.mkdirSync(path.join(guessedPath, 'src'), { recursive: true });
                    project.projectPath = guessedPath;
                    console.log(`  ✅ Directory created!\n`);
                }
            }
        } else {
            console.log(`Project: ${project.name}`);
            console.log(`  ✅ Already has path: ${project.projectPath}\n`);
        }
        
        return project;
    });
    
    // Backup original file
    fs.writeFileSync(tasksFile + '.backup', JSON.stringify(JSON.parse(fs.readFileSync(tasksFile, 'utf8')), null, 2));
    console.log(`📦 Backup saved to: ${tasksFile}.backup`);
    
    // Write updated data
    fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2));
    console.log(`✅ Updated ${tasksFile}\n`);
    
    // Show summary
    console.log('Summary:');
    data.projects.forEach(p => {
        console.log(`- ${p.name}: ${p.projectPath || 'NO PATH'}`);
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}

console.log('\n🎉 Done! Restart the kanban server to see changes.');
console.log('Run: npm start');