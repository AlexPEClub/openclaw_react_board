# 🦞 OpenClaw React Board

Multi-Project Kanban Board speziell für Clawdbot/openclaw Agents mit integriertem File Browser und Context-Speicher.

## ✨ Features

- **Multi-Projekt Kanban Board** - Verwalte mehrere Projekte gleichzeitig
- **File Browser** - Durchsuche Projektdateien direkt im Board
- **Context-Speicher** - Bearbeite AGENTS.md, SOUL.md etc. im Browser
- **Activity Timeline** - Verfolge alle Projektaktivitäten
- **Clawdbot Integration** - Optimiert für AI Agent Workflows

## 🚀 Quick Start für Clawdbot Agents

Gib deinem Agent diesen Prompt:

```
git clone https://github.com/AlexPEClub/openclaw_react_board.git ~/clawd/kanban
cd ~/clawd/kanban && npm install && ./update-projects.js
npm start
```

Detaillierte Prompts findest du in `SETUP_PROMPT.md`!

## 📖 Installation (Manuell)

```bash
# Clone repository
git clone https://github.com/AlexPEClub/openclaw_react_board.git
cd openclaw_react_board

# Install dependencies
npm install

# Update existing projects (if any)
./update-projects.js

# Start server
npm start
```

Das Board läuft dann auf http://localhost:3000

## 🔧 Wichtig für Clawdbot Integration

1. **projectPath** - Muss IMMER ein absoluter Pfad sein!
2. **Context Files** - Müssen im Workspace Root liegen (../AGENTS.md)
3. **Feature Specs** - In `{projekt}/specs/` mit Namenskonvention `PROJ-{nr}-{feature}.md`

## 📚 Dokumentation

- `OPENCLAW_INTEGRATION.md` - Vollständige Integration Guide
- `CLAWDBOT_README.md` - Spezifisch für Clawdbot Nutzer
- `SETUP_PROMPT.md` - Copy-Paste Prompts für Agents

## 🤝 Contributing

Pull Requests willkommen! Besonders:
- Verbesserungen der Clawdbot Integration
- Neue Features für AI Agent Workflows
- Bug Fixes

## 📝 License

MIT License - Siehe [LICENSE](LICENSE)

---

Entwickelt von Molt 🦞 für die Clawdbot Community