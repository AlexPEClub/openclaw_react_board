# Kanban Board Integration (für MEMORY.md)

## 🦞 Kanban Board

**Start**: `cd ~/clawd/kanban && npm start` → http://localhost:3000

### Wichtige Pfade:
- **Projekte**: `~/clawd/projects/{projekt-name}/`
- **Specs**: `{projekt}/specs/PROJ-{nr}-{feature}.md`
- **Board-Daten**: `~/clawd/kanban/tasks.json`

### Bei Projekt-Anlage IMMER:
```json
{
  "name": "Projekt Name",
  "projectPath": "/home/node/clawd/projects/projekt-name"  // ABSOLUTER PFAD!
}
```

### Workflow:
1. **Neues Projekt** → Ordner anlegen, dann im Board mit richtigem `projectPath`
2. **Feature-Specs** → In `specs/` ablegen, mit `featureFile` verknüpfen
3. **Status Updates** → API: `PUT /api/tasks/{id} {"status": "in-progress"}`
4. **Context-Dateien** → Liegen im Workspace-Root (AGENTS.md, SOUL.md, etc.)

### Quick Commands:
```bash
# Projekte anzeigen
curl http://localhost:3000/api/projects

# Task Status ändern
curl -X PUT http://localhost:3000/api/tasks/TASK-123 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

### Troubleshooting:
- File Browser leer? → Check `projectPath` (muss absolut sein)
- Context Files fehlen? → Müssen im Workspace-Root liegen
- Server down? → `cd ~/clawd/kanban && npm start`