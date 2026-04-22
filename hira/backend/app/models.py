from enum import Enum
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class IncidentType(str, Enum):
    FIRE = "FIRE"
    NORMAL = "NORMAL"
    UNKNOWN = "UNKNOWN"


class ActionType(str, Enum):
    EVACUATE = "EVACUATE"
    CALL_FIRE_DEPT = "CALL_FIRE_DEPT"
    ACTIVATE_SPRINKLER = "ACTIVATE_SPRINKLER"
    MONITOR = "MONITOR"


class IncidentState(BaseModel):
    fire_detected: bool = Field(default=False)
    smoke_level: int = Field(default=0, ge=0, le=10)
    people_inside: int = Field(default=0, ge=0)
    exits_blocked: List[str] = Field(default_factory=list)
    blocked_nodes: List[str] = Field(default_factory=list)
    sprinkler_working: bool = Field(default=True)
    location: str = Field(default="RoomA", min_length=1)
    planning_algorithm: str = Field(default="astar")
    node_smoke_levels: Dict[str, int] = Field(default_factory=dict)

    @field_validator("exits_blocked", "blocked_nodes")
    @classmethod
    def clean_node_lists(cls, value: List[str]) -> List[str]:
        return [entry.strip() for entry in value if entry and entry.strip()]

    @field_validator("planning_algorithm")
    @classmethod
    def validate_planning_algorithm(cls, value: str) -> str:
        normalized = value.lower().strip()
        if normalized not in {"astar", "bfs"}:
            raise ValueError("planning_algorithm must be 'astar' or 'bfs'")
        return normalized


class DecisionScore(BaseModel):
    action: ActionType
    score: float
    rationale: str


class DecisionMetadata(BaseModel):
    confidence: float
    reason: str
    policy: str = "risk_priority_v1"
    tie_break: Optional[str] = None


class ExplanationDetails(BaseModel):
    summary: str
    key_factors: List[str]
    reasoning_steps: List[str]
    final_justification: str


class IncidentResponse(BaseModel):
    incident_type: IncidentType
    risks: List[str]
    decision: ActionType
    decision_scores: List[DecisionScore]
    decision_metadata: DecisionMetadata
    evacuation_path: List[str]
    planning_algorithm: str
    explanation: str
    explanation_details: ExplanationDetails
    probability_of_fire: Optional[float] = None
    blocked_exits: List[str] = Field(default_factory=list)
    blocked_nodes: List[str] = Field(default_factory=list)


class ErrorEnvelope(BaseModel):
    error: Dict[str, str]
