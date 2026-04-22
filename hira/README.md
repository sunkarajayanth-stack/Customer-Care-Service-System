# Hybrid Incident Response Agent (HIRA)

HIRA is a full-stack, explainable incident response simulator that performs detection → reasoning → planning → decisioning → explanation for building emergencies.

## ✨ Highlights
- FastAPI backend with modular AI pipeline.
- Weighted A* planning with hazard-aware penalties.
- Utility-based decisions with confidence + tie-break metadata.
- Structured explanation output for readable UI.
- React + Tailwind dashboard with presets, map legend, and incident history.
- Docker Compose + CI + tests.

## 🧱 Architecture Diagram
```text
Frontend (React)
   │  POST /incident
   ▼
FastAPI Orchestrator
   ├─ Detection
   ├─ Reasoning
   ├─ Planning (BFS / hazard-aware A*)
   ├─ Decision (utility + confidence + tie-break)
   └─ Explanation (summary + factors + steps + justification)
```

## 🖼️ Screenshots
> Add images here after running locally:
- `docs/screenshots/dashboard.png`
- `docs/screenshots/incident-fire.png`

## ⚙️ Environment
```bash
cp .env.example .env
```

`.env.example`:
```env
API_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## 🚀 Quick Start (Docker)
```bash
cd hira
make docker-up
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## 🧪 Local Dev
### Backend
```bash
cd hira/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd hira/frontend
npm install
npm run dev
```

## 🎬 Demo Flow
1. Open frontend.
2. Click a preset (Normal, Fire Emergency, Blocked Exits, High Occupancy).
3. Submit incident.
4. Observe:
   - decision + confidence + policy,
   - structured explanation,
   - path + blocked-node map rendering,
   - recent incident history.

## ✅ Test
```bash
cd hira/backend
pytest -q
python -m compileall app tests main.py
```

## 🛠️ Makefile shortcuts
```bash
make test
make docker-up
```

## 📚 Additional docs
- `docs/architecture.md`
- `docs/algorithms.md`
- `docs/usage.md`
- `docs/report.md`
