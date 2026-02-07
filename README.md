# 🦞 Molt's Kanban Board - React Version

Die moderne React-Portierung des Vanilla JS Kanban Boards mit allen Features und verbesserter Architektur.

## 🚀 Features

- ⚛️ **React 18** mit Hooks und funktionalen Komponenten
- 🛣️ **React Router** für Navigation
- 🎨 **Modernes CSS** mit CSS Modules
- 📦 **Vite** für schnelle Entwicklung und optimierte Builds
- 🔄 **Hot Module Replacement** während der Entwicklung
- 📱 **Responsive Design** für alle Geräte

## 📋 Funktionen

- **Multi-Projekt Management**
- **Drag & Drop** Kanban Board
- **File Browser** mit Syntax Highlighting
- **Context-Speicher** für Agent-Konfiguration
- **Activity Timeline** mit chronologischer Übersicht
- **Dashboard** mit Projekt-Statistiken

## 🛠️ Installation

```bash
# Repository klonen
git clone https://github.com/yourusername/molt-kanban-react.git
cd molt-kanban-react

# Dependencies installieren
npm install

# Development Server starten (Frontend auf Port 3001)
npm run dev

# API Server starten (Backend auf Port 3000)
npm run server

# Oder beide parallel mit:
npm install -g concurrently
concurrently "npm run dev" "npm run server"
```

## 🏗️ Projekt-Struktur

```
molt-kanban-react/
├── src/
│   ├── components/        # Wiederverwendbare Komponenten
│   │   ├── Sidebar.jsx   # Navigation & Projekt-Liste
│   │   └── KanbanBoard.jsx # Kanban Board mit Drag&Drop
│   ├── pages/            # Seiten-Komponenten
│   │   ├── Dashboard.jsx # Übersicht & Statistiken
│   │   ├── Projects.jsx  # Projekt-Detail mit Board
│   │   ├── Activities.jsx # Activity Timeline
│   │   └── ContextFiles.jsx # Agent-Konfiguration
│   ├── styles/           # CSS-Dateien
│   ├── hooks/            # Custom React Hooks
│   ├── utils/            # Hilfsfunktionen
│   ├── App.jsx           # Haupt-App-Komponente
│   └── main.jsx          # React Entry Point
├── server.js             # Express API Server
├── vite.config.js        # Vite Konfiguration
└── package.json          # Dependencies & Scripts
```

## 🔧 Entwicklung

### Frontend Development

```bash
npm run dev
```

- Läuft auf http://localhost:3001
- Hot Module Replacement aktiviert
- Proxy zu API Server konfiguriert

### Backend API

```bash
npm run server
```

- Läuft auf http://localhost:3000
- RESTful API mit Express
- File-basierte Datenspeicherung

### Production Build

```bash
npm run build
npm run preview
```

## 🎯 Verbesserungen gegenüber Vanilla Version

1. **Komponenten-basierte Architektur**
   - Wiederverwendbare UI-Komponenten
   - Klare Trennung von Logik und Darstellung

2. **State Management**
   - React Hooks für lokalen State
   - Props für Komponenten-Kommunikation
   - Möglichkeit für Redux/Zustand Integration

3. **Routing**
   - Client-side Routing mit React Router
   - Direkte URLs zu Projekten/Seiten

4. **Performance**
   - Optimiertes Re-Rendering
   - Code Splitting möglich
   - Lazy Loading für große Komponenten

5. **Developer Experience**
   - Hot Module Replacement
   - Better Error Messages
   - React DevTools Support

## 🚢 Deployment

### Docker

```dockerfile
# Build Stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "server.js"]
```

### Vercel/Netlify

Frontend und Backend können separat deployed werden:
- Frontend auf Vercel/Netlify
- Backend auf Railway/Render

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Committen (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📝 License

MIT License - siehe [LICENSE](LICENSE)

---

**Note**: Dies ist Version 2.0 des Kanban Boards, komplett neu geschrieben in React für bessere Wartbarkeit und Erweiterbarkeit.