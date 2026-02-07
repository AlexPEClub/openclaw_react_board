#!/bin/bash

echo "🦞 Molt's Kanban Board - Setup"
echo "=============================="

# Check if data directory exists
if [ ! -d "data" ]; then
    echo "📁 Erstelle Daten-Verzeichnis..."
    mkdir -p data
    
    # Copy example data if available
    if [ -d "data.example" ]; then
        echo "📋 Kopiere Beispiel-Daten..."
        cp data.example/*.json data/
    else
        # Create empty data files
        echo '{"projects":[]}' > data/tasks.json
        echo '{"activities":[]}' > data/activity.json
    fi
    
    echo "✅ Daten-Verzeichnis erstellt"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
fi

echo ""
echo "✨ Setup abgeschlossen!"
echo ""
echo "Starte den Server mit: npm start"
echo "Das Board läuft dann auf: http://localhost:3000"