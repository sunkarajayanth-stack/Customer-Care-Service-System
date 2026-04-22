.PHONY: dev test docker-up

dev:
	@echo "Start backend and frontend in separate terminals"
	@echo "Backend: cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"
	@echo "Frontend: cd frontend && npm install && npm run dev"

test:
	cd backend && pytest -q && python -m compileall app tests main.py

docker-up:
	@if command -v docker-compose >/dev/null 2>&1; then \
		docker-compose up --build; \
	elif command -v docker >/dev/null 2>&1; then \
		docker compose up --build; \
	else \
		echo "Docker CLI not found. Install docker/docker-compose first."; \
		exit 1; \
	fi
