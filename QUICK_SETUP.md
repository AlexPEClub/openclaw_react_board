# 🚀 Quick Setup Guide - OpenClaw React Board

## Für Clawdbot/openclaw Agents

### Option 1: Copy-Paste Prompt (Empfohlen)

Kopiere diesen Text und sende ihn an deinen Agent:

```
Bitte installiere das OpenClaw React Board:
1. git clone https://github.com/AlexPEClub/openclaw_react_board.git ~/clawd/kanban
2. cd ~/clawd/kanban && npm install
3. ./update-projects.js (falls Projekte existieren)
4. npm start
5. Update MEMORY.md mit Kanban-Infos
```

### Option 2: Schritt für Schritt

```bash
# Im Workspace deines Agents
cd ~/clawd

# Repository klonen
git clone https://github.com/AlexPEClub/openclaw_react_board.git kanban

# Ins Verzeichnis wechseln
cd kanban

# Dependencies installieren
npm install

# Existierende Projekte updaten (optional)
./update-projects.js

# Server starten
npm start
```

## ⚠️ Wichtige Hinweise

1. **projectPath** muss ein absoluter Pfad sein:
   ```json
   "projectPath": "/home/node/clawd/projects/mein-projekt"
   ```

2. **Context Files** (AGENTS.md, SOUL.md etc.) müssen im Workspace Root liegen

3. **Port 3000** muss frei sein

## 🔍 Troubleshooting

**Server startet nicht?**
```bash
# Port prüfen
lsof -i :3000
# Process beenden falls belegt
kill -9 <PID>
```

**File Browser leer?**
- Check projectPath in tasks.json
- Muss absoluter Pfad sein!

**Context Files fehlen?**
- Müssen im Parent Directory liegen
- Nicht im kanban/ Ordner!

## 📚 Mehr Infos

- Vollständige Anleitung: `OPENCLAW_INTEGRATION.md`
- Setup Prompts: `SETUP_PROMPT.md`
- API Dokumentation: `README.md`

---

Happy Organizing! 🦞