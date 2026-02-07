# 🦞 Molt's Multi-Project Kanban Board

Ein elegantes, dark-themed Kanban Board für Multi-Projekt-Management mit integriertem File Browser und Context-Speicher. Speziell optimiert für Clawdbot/openclaw Integration.

![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Clawdbot](https://img.shields.io/badge/Clawdbot-Ready-orange)

## ✨ Features

- **Multi-Projekt Support** - Verwalte mehrere Projekte mit eigenem Kanban Board
- **Kanban Board** - 4 Spalten: Offen, In Arbeit, Review, Erledigt
- **File Browser** - Integrierter Datei-Explorer mit Syntax Highlighting
- **Context-Speicher** - Zentrale Ablage für Projekt-Dokumentation
- **Activity Log** - Chronologische Ansicht aller Projekt-Aktivitäten
- **Dark Theme** - Augenschonendes GitHub-inspiriertes Design
- **Markdown Support** - Vorschau von Markdown-Dateien
- **Responsive** - Funktioniert auf Desktop und Tablet

## 🚀 Quick Start

### Installation

```bash
# Repository klonen
git clone https://github.com/AlexPEClub/openclaw_react_board.git
cd openclaw_react_board

# Dependencies installieren
npm install

# Server starten
npm start
```

### Clawdbot/openclaw Agent Installation

Für Clawdbot Agents siehe `SETUP_PROMPT.md` für einfache Copy-Paste Prompts!

Das Board läuft dann auf: http://localhost:3000

### Docker

```bash
# Mit Docker Compose
docker-compose up

# Oder direkt mit Docker
docker build -t molt-kanban .
docker run -p 3000:3000 -v $(pwd)/data:/app/data molt-kanban
```

## 📁 Projekt-Struktur

```
openclaw_react_board/
├── app.js              # Express Server
├── index.html          # Frontend (Single Page App)
├── package.json        # Dependencies
├── data/               # Persistente Daten (wird automatisch erstellt)
│   ├── tasks.json      # Alle Tasks und Projekte
│   └── activity.json   # Activity Log
└── README.md           # Diese Datei
```

## 🛠️ Konfiguration

### Environment Variables

```bash
PORT=3000              # Server Port (default: 3000)
DATA_DIR=./data        # Daten-Verzeichnis (default: ./data)
```

### Context Files

Die Context-Dateien werden im Workspace-Root gesucht. Standard-Pfade:
- `AGENTS.md` - Agent-Konfiguration
- `SOUL.md` - Persönlichkeit & Verhalten
- `USER.md` - Nutzer-Informationen
- `MEMORY.md` - Langzeit-Gedächtnis
- `TOOLS.md` - Tool-Dokumentation

## 🎨 Anpassungen

### Eigene Projekte hinzufügen

Klicke im UI auf "+ Neues Projekt" oder füge direkt in `data/tasks.json` ein:

```json
{
  "id": "proj-unique-id",
  "name": "Mein Projekt",
  "description": "Projekt Beschreibung",
  "color": "#56031f",
  "tasks": []
}
```

### Spalten anpassen

In `index.html` die `columns` Variable bearbeiten:

```javascript
const columns = [
    { id: 'backlog', title: 'Backlog', icon: '📚' },
    { id: 'todo', title: 'Todo', icon: '📋' },
    // ... weitere Spalten
];
```

## 🔧 API Endpoints

- `GET /api/projects` - Alle Projekte abrufen
- `POST /api/projects` - Neues Projekt erstellen
- `GET /api/projects/:id` - Einzelnes Projekt
- `POST /api/projects/:id/tasks` - Task hinzufügen
- `PUT /api/tasks/:id` - Task aktualisieren
- `GET /api/context-files` - Context-Dateien auflisten
- `GET /api/files/*` - Datei-Browser API
- `GET /api/activity` - Activity Log

## 🤝 Contributing

Contributions sind willkommen! Bitte:

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🦞 Credits

Entwickelt von Molt (AI Assistant) für die Clawdbot Community.

---

**Hinweis**: Dies ist eine frühe Version. Bugs und Feature Requests bitte als [GitHub Issues](https://github.com/AlexPEClub/openclaw_react_board/issues) melden.