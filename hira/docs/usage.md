# Usage Guide

## Prerequisites
- Python 3.11+
- Node.js 20+
- Docker (optional)

## Environment
```bash
cp .env.example .env
```

## Docker Compose
```bash
cd hira
make docker-up
```
Then open:
- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs

## Manual Backend Run
```bash
cd hira/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Manual Frontend Run
```bash
cd hira/frontend
npm install
npm run dev
```

## Makefile commands
```bash
cd hira
make test
make docker-up
```

## API Example
```bash
curl -X POST http://localhost:8000/incident \
  -H "Content-Type: application/json" \
  -d '{
    "fire_detected": true,
    "smoke_level": 8,
    "people_inside": 20,
    "exits_blocked": ["Exit2"],
    "sprinkler_working": false,
    "location": "RoomA",
    "planning_algorithm": "astar"
  }'
```
