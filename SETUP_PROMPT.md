# Kanban Board Setup - Prompt für Clawdbot

Kopiere den Setup-Prompt und gib ihn deinem Clawdbot/openclaw Agent.

---

## Setup-Prompt

```
Bitte installiere und konfiguriere dieses speziell für OpenClaw entwickelte Projektmanagement inkl. Kanban Board, File Explorer und Kontext-Manager von GitHub für mich. Darauf arbeiten wir zukünftig gemeinsam an unseren Softwareprojekten:

SETUP:
1. cd ~/.openclaw/workspace
2. git clone https://github.com/AlexPEClub/openclaw_react_board.git kanban
3. cd kanban && npm install
4. Prüfe ob bereits Projekte existieren und führe ggf. ./update-projects.js aus
5. Starte den Server: OPENCLAW_WORKSPACE=$(cd .. && pwd) npm start
   (Setzt den Context-Files Pfad automatisch auf dein Workspace-Verzeichnis)

KONFIGURATION:
1. Lies die README.md im kanban-Ordner für die vollständige Dokumentation
2. Lies die SETUP_PROMPT.md und füge den dort enthaltenen MEMORY.md Snippet in deine MEMORY.md ein
3. Optional: Füge den HEARTBEAT.md Snippet aus SETUP_PROMPT.md in deine HEARTBEAT.md ein

ERKLÄRUNG:
- Zeige mir wie ich ein neues Projekt anlege (mit korrektem projectPath)
- Erkläre wie Feature-Specs verknüpft werden
- Zeige mir die wichtigsten API-Befehle

Bestätige jeden Schritt und zeige mir am Ende die URL zum Board.
```

---

## Nach der Installation

Dein Agent sollte dir folgendes bestätigen:
- Server läuft auf http://localhost:3000
- MEMORY.md wurde aktualisiert
- Bestehende Projekte haben projectPath gesetzt
- Context-Files werden aus Workspace geladen

---

## MEMORY.md Snippet

Diesen Block sollte der Agent in seine MEMORY.md einfügen (kuratierte Langzeit-Info):

    ## Kanban Board

    **Start**: `cd ~/.openclaw/workspace/kanban && OPENCLAW_WORKSPACE=$(cd .. && pwd) npm start`
    **URL**: http://localhost:3000

    ### Wichtige Pfade:
    - **Board-Daten**: ~/.openclaw/workspace/kanban/tasks.json
    - **Feature-Files**: {projekt}/features/PROJ-{nr}-{feature}.md

    ### Bei Projekt-Anlage IMMER:
    - `projectPath` als absoluten Pfad setzen!

    ### Feature-Files anlegen:
    - Feature-Dateien gehören in den `features/`-Ordner des Projekts (NICHT `specs/`)
    - Erst die Datei in `features/` erstellen, dann im Task per `featureFile` verknüpfen
    - Namenskonvention: PROJ-{nr}-{feature-name}.md

    ### Workflow:
    1. Neues Projekt → Ordner anlegen (inkl. `features/`), dann im Board mit richtigem `projectPath`
    2. Feature-Files → In `features/` ablegen, mit `featureFile` im Task verknüpfen
    3. Status Updates → API: `PUT /api/tasks/{id} {"status": "in-progress"}`
    4. Context-Dateien → Werden aus OPENCLAW_WORKSPACE geladen

    ### Quick Commands:
    curl http://localhost:3000/api/projects
    curl -X PUT http://localhost:3000/api/tasks/TASK-ID -H "Content-Type: application/json" -d '{"status": "done"}'

    ### Troubleshooting:
    - File Browser leer? → Check `projectPath` (muss absolut sein)
    - Context Files fehlen? → Prüfe OPENCLAW_WORKSPACE Pfad
    - Server down? → Neu starten (siehe Start-Befehl oben)

---

## HEARTBEAT.md Snippet (optional)

    ## Kanban Board Check
    - [ ] Kanban Server läuft? Wenn nicht: starten (siehe MEMORY.md)
    - [ ] In-Progress Tasks vorhanden? → Status in agent-status.json aktualisieren
    - [ ] Neue Feature-Specs? → Als Tasks hinzufügen

---

## Troubleshooting-Prompts

Falls Probleme auftreten, gib deinem Agent einen dieser Prompts:

**File Browser zeigt nichts:**
```
Der File Browser im Kanban Board zeigt keine Dateien.
Prüfe bitte den projectPath in tasks.json - er muss ein absoluter Pfad sein.
Nutze ggf. update-projects.js um die Pfade zu korrigieren.
```

**Context Files fehlen:**
```
Die Context-Speicher Seite zeigt keine Dateien.
Prüfe den OPENCLAW_WORKSPACE Pfad. Er sollte auf dein Workspace-Verzeichnis zeigen.
Starte den Server ggf. neu mit: OPENCLAW_WORKSPACE=/dein/workspace/pfad npm start
```

**Server startet nicht:**
```
Das Kanban Board startet nicht. Prüfe:
1. Ist Port 3000 frei? (lsof -i :3000)
2. Sind alle Dependencies installiert? (npm install)
3. Gibt es Fehler in der Console?
```
