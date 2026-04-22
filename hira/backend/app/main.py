import logging
import time
import uuid
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.decision import choose_action
from app.detection import detect_incident, estimate_fire_probability
from app.explanation import generate_explanation
from app.models import IncidentResponse, IncidentState
from app.planning import find_exit_path, load_building_map
from app.reasoning import infer_risks
from app.settings import get_settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s [%(name)s] %(message)s")
logger = logging.getLogger("hira")
settings = get_settings()

app = FastAPI(title=settings.app_name, version=settings.app_version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_request_context(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    response.headers["X-Request-ID"] = request_id
    logger.info("%s %s -> %s (%.2fms) request_id=%s", request.method, request.url.path, response.status_code, duration_ms, request_id)
    return response


@app.on_event("startup")
async def startup_event():
    logger.info(
        "HIRA backend ready | version=%s | cors_origins=%s",
        settings.app_version,
        ",".join(settings.cors_origins),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning("HTTPException on %s: %s", request.url.path, exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"error": {"type": "http_error", "message": str(exc.detail)}})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning("Validation error on %s", request.url.path)
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "type": "validation_error",
                "message": "Invalid incident payload",
                "details": exc.errors(),
            }
        },
    )


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "version": settings.app_version}


@app.get("/map")
def get_map() -> Dict[str, List[str]]:
    return load_building_map()


@app.post("/incident", response_model=IncidentResponse)
def process_incident(state: IncidentState) -> IncidentResponse:
    logger.info("Processing incident at location=%s smoke=%s", state.location, state.smoke_level)

    map_data = load_building_map()
    if state.location not in map_data:
        raise HTTPException(status_code=422, detail=f"Unknown location '{state.location}'.")

    incident_type = detect_incident(state)
    probability_of_fire = estimate_fire_probability(state)
    risks = infer_risks(state)

    blocked_nodes = list(set(state.blocked_nodes + state.exits_blocked))
    path, algo = find_exit_path(
        start=state.location,
        exits=[node for node in map_data if node.startswith("Exit")],
        blocked_nodes=blocked_nodes,
        node_smoke_levels=state.node_smoke_levels,
        smoke_weight=0.2,
        blocked_penalty=8.0,
        algorithm=state.planning_algorithm,
    )

    scored_actions, chosen_action, decision_metadata = choose_action(state, risks)
    explanation_text, explanation_details = generate_explanation(state, risks, chosen_action.action, path, probability_of_fire)

    return IncidentResponse(
        incident_type=incident_type,
        risks=risks,
        decision=chosen_action.action,
        decision_scores=scored_actions,
        decision_metadata=decision_metadata,
        evacuation_path=path,
        planning_algorithm=algo,
        explanation=explanation_text,
        explanation_details=explanation_details,
        probability_of_fire=probability_of_fire,
        blocked_exits=state.exits_blocked,
        blocked_nodes=state.blocked_nodes,
    )


@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "name": settings.app_name,
        "endpoints": ["POST /incident", "GET /map", "GET /health"],
        "docs": "/docs",
    }
