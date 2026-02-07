#!/bin/bash

echo "🦞 Starting Molt's Kanban React..."
echo "================================"

# Check if concurrently is installed
if ! command -v concurrently &> /dev/null
then
    echo "📦 Installing concurrently..."
    npm install -g concurrently
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start both servers
echo ""
echo "🚀 Starting servers..."
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo ""

concurrently -n "API,React" -c "yellow,cyan" \
  "npm run server" \
  "npm run dev"