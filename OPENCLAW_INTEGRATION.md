# 🦞 Kanban Board - Clawdbot Integration Guide

Diese Anleitung erklärt, wie du als Clawdbot/openclaw Agent das Kanban Board richtig nutzt und integrierst.

## 📋 Übersicht

Das Kanban Board ist dein zentrales Projektmanagement-Tool. Es verwaltet:
- Projekte mit Aufgaben in 4 Phasen (Todo, In Progress, Review, Done)
- File Browser für Projekt-Dateien
- Context-Speicher für deine Workspace-Konfiguration
- Activity Log für alle Änderungen

## 🚀 Installation & Start

```bash
# Im Workspace-Verzeichnis
cd ~/clawd/kanban  # oder wo auch immer dein Workspace ist
npm install
npm start

# Server läuft auf Port 3000
# Zugriff: http://localhost:3000
```

## 📁 Projekt-Struktur verstehen

### Wichtige Dateien:
- `tasks.json` - Alle Projekte und Aufgaben
- `activity.json` - Aktivitäten-Log
- `agent-status.json` - Dein Status (Verfügbar/Beschäftigt)

### Projekt-Schema in tasks.json:
```json
{
  "id": "proj-xxx",
  "name": "Projektname",
  "description": "Beschreibung",
  "projectPath": "/home/node/clawd/projects/mein-projekt",  // WICHTIG!
  "tasks": [
    {
      "id": "PROJ-1",
      "title": "Feature Name",
      "featureFile": "PROJ-1-feature-name.md",  // Verknüpfung zur Spec
      "status": "todo|in-progress|review|done"
    }
  ]
}
```

## 🔧 Integration mit deinem Workspace

### 1. Projekt anlegen mit korrektem Pfad

```javascript
// Bei Projekt-Erstellung IMMER projectPath setzen!
{
  "name": "Mein Projekt",
  "projectPath": "/home/node/clawd/projects/mein-projekt"  // Absoluter Pfad!
}
```

### 2. Feature-Spezifikationen verknüpfen

Wenn du Feature-Specs erstellst (z.B. mit der AI Coding Pipeline):

```bash
# Feature-Spec erstellen im Projektverzeichnis
/projects/mein-projekt/specs/PROJ-1-user-auth.md
```

Dann im Task verknüpfen:
```javascript
{
  "id": "PROJ-1",
  "title": "User Authentication",
  "featureFile": "PROJ-1-user-auth.md",  // Wird im File Browser angezeigt
  "status": "todo"
}
```

### 3. Context-Speicher Dateien

Das Board sucht diese Dateien im **Workspace-Root** (nicht im kanban-Ordner!):

- `AGENTS.md` - Deine Agent-Konfiguration
- `SOUL.md` - Persönlichkeit & Verhalten  
- `USER.md` - User-Informationen
- `MEMORY.md` - Langzeit-Gedächtnis
- `TOOLS.md` - Tool-Dokumentation
- `HEARTBEAT.md` - Periodische Aufgaben

**Wichtig**: Diese werden aus dem Parent-Directory geladen:
```javascript
// In app.js - Context Files werden so geladen:
const workspaceDir = path.join(__dirname, '..')  // Ein Ordner höher!
```

## 📝 Best Practices für Agent-Integration

### 1. Bei Projekt-Erstellung

```bash
# Immer diese Struktur erstellen:
mkdir -p /home/node/clawd/projects/projekt-name
cd /home/node/clawd/projects/projekt-name
mkdir -p specs docs src tests

# Dann Projekt im Board anlegen mit richtigem projectPath!
```

### 2. Status automatisch aktualisieren

Wenn du an einer Aufgabe arbeitest:
```bash
# Task auf "in-progress" setzen
curl -X PUT http://localhost:3000/api/tasks/TASK-ID \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

### 3. Activity Log nutzen

Wichtige Aktionen werden automatisch geloggt. Du kannst auch manuell loggen:
```bash
# Aktivität hinzufügen (via API - noch nicht implementiert, aber geplant)
```

### 4. File Browser Integration

Der File Browser zeigt Dateien aus `projectPath`. Stelle sicher dass:
- Projekt-Verzeichnis existiert
- Richtige Permissions gesetzt sind
- Relative Pfade vermieden werden

## 🤖 Automatisierung mit Clawdbot

### Memory.md Eintrag hinzufügen:

```markdown
## Kanban Board Integration

- **URL**: http://localhost:3000
- **Auto-Start**: `cd ~/clawd/kanban && npm start`
- **Projekt-Root**: ~/clawd/projects/
- **Specs-Ordner**: {projekt}/specs/
- **Feature-Files**: PROJ-{nummer}-{feature-name}.md

### Workflow:
1. Neues Projekt? → Erstelle Ordner-Struktur
2. Neue Aufgabe? → Verknüpfe featureFile wenn vorhanden
3. Status-Updates → API calls beim Arbeiten
4. Context-Dateien → Werden aus Workspace-Root geladen
```

### Heartbeat Integration:

In `HEARTBEAT.md`:
```markdown
## Kanban Board Check

- [ ] Server läuft? Wenn nicht: `cd ~/clawd/kanban && npm start`
- [ ] In-Progress Tasks vorhanden? → Status in agent-status.json aktualisieren
- [ ] Neue Feature-Specs? → Als Tasks hinzufügen
```

## 🔍 Häufige Probleme & Lösungen

### "File Browser zeigt keine Dateien"
→ Prüfe `projectPath` in tasks.json - muss absoluter Pfad sein!

### "Context-Dateien nicht sichtbar"
→ Dateien müssen im Workspace-Root liegen, nicht im kanban-Ordner

### "Feature-Files werden nicht verknüpft"
→ `featureFile` Property im Task muss exakt dem Dateinamen entsprechen

### "Status wird nicht aktualisiert"
→ agent-status.json muss im kanban-Ordner liegen und schreibbar sein

## 🛠️ API Quick Reference

```bash
# Projekte abrufen
GET /api/projects

# Projekt erstellen (mit projectPath!)
POST /api/projects
{
  "name": "Projekt Name",
  "description": "Beschreibung",
  "projectPath": "/absoluter/pfad/zum/projekt"
}

# Task hinzufügen
POST /api/projects/{projectId}/tasks
{
  "title": "Task Titel",
  "featureFile": "PROJ-1-feature.md",  // Optional
  "status": "todo",
  "priority": "high"
}

# Task Status ändern
PUT /api/tasks/{taskId}
{
  "status": "in-progress"
}

# Context-Files abrufen
GET /api/context-files

# File Browser
GET /api/files/{projectId}/*
```

## 💡 Tipps für die tägliche Nutzung

1. **Morgen-Routine**: Prüfe Dashboard für Überblick
2. **Bei Task-Start**: Status auf "in-progress" setzen
3. **Feature-Specs**: Immer im specs/ Ordner ablegen
4. **Context-Updates**: Direkt im Board bearbeiten
5. **Projekt-Ende**: Tasks auf "done" verschieben

---

**Remember**: Das Board ist dein Gedächtnis für Projekte. Halte es aktuell! 🦞