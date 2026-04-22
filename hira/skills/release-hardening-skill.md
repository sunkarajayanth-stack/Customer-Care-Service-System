# Skill: Release Hardening

## Goal
Ship a stable, deployable version of HIRA.

## Checklist
1. Backend tests pass.
2. Frontend builds with no fatal warnings.
3. `docker-compose up --build` starts both services.
4. `/health`, `/map`, and `/incident` are reachable.
5. UI renders decision + explanation + map path correctly.
6. README and usage docs match real commands.
7. CI pipeline status is green.

## Fast Commands
```bash
cd hira/backend && pytest -q
cd hira/frontend && npm run build
cd hira && docker-compose up --build
```
