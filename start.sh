#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting Randahaws Heel Shoes..."
echo ""

echo "📦 Starting Django Backend on :8000..."
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!
cd ..

sleep 2

echo "🎨 Starting React Frontend on :5173..."
cd frontend
NODE_OPTIONS="--max-old-space-size=512" npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Backend:  http://localhost:8000"
echo "✅ Frontend: http://localhost:5173"
echo "✅ Admin:    http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
