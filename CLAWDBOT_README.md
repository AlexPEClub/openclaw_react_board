# 🦞 Kanban Board für Clawdbot/openclaw

Dieses Kanban Board ist speziell für die Integration mit Clawdbot/openclaw Agents entwickelt.

## 🚀 Schnellstart für Agents

GitHub Repository: https://github.com/AlexPEClub/openclaw_react_board

Gib deinem Agent einfach diesen Prompt:

```
git clone https://github.com/AlexPEClub/openclaw_react_board.git ~/clawd/kanban
cd ~/clawd/kanban && npm install && ./update-projects.js
npm start
Update MEMORY.md mit Kanban-Infos
```

Oder nutze SETUP_PROMPT.md für detaillierte Prompts!

## 🎯 Was ist neu?

### Clawdbot Integration Features:
1. **Automatische Workspace-Integration** - Context Files aus dem Agent-Workspace
2. **Project Path Mapping** - File Browser zeigt echte Projektdateien
3. **Feature-Spec Verknüpfung** - Tasks mit .md Specs verbinden
4. **Agent Status Tracking** - Verfügbar/Beschäftigt basierend auf aktiven Tasks

## 📦 Installation für Clawdbot Agents

```bash
# 1. Repository klonen
cd ~/clawd  # oder dein Workspace
git clone https://github.com/AlexPEClub/openclaw_react_board.git kanban

# 2. Dependencies installieren
cd kanban
npm install

# 3. Bestehende Projekte updaten (falls vorhanden)
./update-projects.js

# 4. Server starten
npm start
```

## 📚 Wichtige Dokumentation

1. **OPENCLAW_INTEGRATION.md** - Vollständige Anleitung für Agents
2. **MEMORY_SNIPPET.md** - Kurze Version für deine MEMORY.md
3. **update-projects.js** - Script zum Nachträglich setzen von projectPath

## 🔧 Konfiguration

### Projekt-Struktur die erwartet wird:
```
~/clawd/
├── kanban/              # Das Kanban Board
├── projects/            # Deine Projekte
│   ├── mein-projekt/
│   │   ├── specs/       # Feature Specifications
│   │   ├── docs/        # Dokumentation
│   │   └── src/         # Source Code
│   └── anderes-projekt/
├── AGENTS.md           # Agent Config
├── SOUL.md             # Persönlichkeit
├── MEMORY.md           # Langzeitgedächtnis
└── TOOLS.md            # Tool Docs
```

### Projekt anlegen mit korrektem Path:
```bash
# Via API
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mein Projekt",
    "description": "Beschreibung",
    "projectPath": "/home/node/clawd/projects/mein-projekt"
  }'
```

### Feature-Spec verknüpfen:
```bash
# Task mit Feature-File
curl -X POST http://localhost:3000/api/projects/{projectId}/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "User Authentication",
    "featureFile": "PROJ-1-user-auth.md",
    "status": "todo"
  }'
```

## 🤖 Integration in Agent-Workflows

### In MEMORY.md hinzufügen:
```markdown
## Kanban Board
- Start: `cd ~/clawd/kanban && npm start`
- URL: http://localhost:3000
- Bei neuen Projekten: projectPath setzen!
- Feature-Specs: In {projekt}/specs/ ablegen
```

### In HEARTBEAT.md für Auto-Start:
```markdown
- [ ] Kanban Server läuft? Wenn nicht: `cd ~/clawd/kanban && npm start`
```

## 🆚 Unterschiede zur Standard-Version

Diese Version hat spezielle Anpassungen für Clawdbot:

1. **Context-Files** laden aus dem Parent-Verzeichnis (nicht kanban/)
2. **File Browser** nutzt `projectPath` für echte Projekt-Integration
3. **Agent Status** API für Verfügbarkeits-Tracking
4. **Update Script** für bestehende Projekte

## 🚀 Tips für Agents

1. **Immer absolute Pfade** bei projectPath verwenden
2. **Feature-Specs** konsistent benennen: `PROJ-{nummer}-{feature}.md`
3. **Status Updates** bei Task-Bearbeitung nicht vergessen
4. **Context Files** regelmäßig im Board bearbeiten statt manuell

## 🐛 Troubleshooting

- **File Browser zeigt nichts?** → projectPath prüfen
- **Context Files fehlen?** → Müssen im Workspace-Root sein
- **Server startet nicht?** → Port 3000 frei? `lsof -i :3000`

---

Happy Organizing! 🦞