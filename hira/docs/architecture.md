# HIRA Architecture

## System Design
HIRA is a two-tier system:
1. **Backend (FastAPI)** for incident intelligence and APIs.
2. **Frontend (React + TailwindCSS)** for interaction and visualization.

## Module Breakdown
- `detection.py`: classifies incidents (FIRE, NORMAL, UNKNOWN) and computes optional fire probability.
- `reasoning.py`: infers risk labels from rules.
- `planning.py`: loads building graph and computes safe route with BFS/A*.
- `decision.py`: utility-based action scoring and final action ranking.
- `explanation.py`: generates human-readable explanation.
- `main.py`: orchestrates modules and exposes `/incident` + `/map`.

## Data Flow
1. User submits incident state from `InputForm`.
2. Frontend calls `POST /incident`.
3. Backend pipeline: detect → reason → plan → decide → explain.
4. JSON response returned to dashboard.
5. Decision and path are visualized in panels.

## Diagram (text)
`Input -> API -> Detection -> Reasoning -> Planning -> Decision -> Explanation -> UI`
