from app.models import IncidentState, IncidentType


def detect_incident(state: IncidentState) -> IncidentType:
    if state.fire_detected and state.smoke_level >= 4:
        return IncidentType.FIRE
    if not state.fire_detected and state.smoke_level <= 2:
        return IncidentType.NORMAL
    return IncidentType.UNKNOWN


def estimate_fire_probability(state: IncidentState) -> float:
    score = 0.0
    score += 0.55 if state.fire_detected else 0.05
    score += min(state.smoke_level / 10.0, 1.0) * 0.35
    score += 0.10 if not state.sprinkler_working else 0.0
    return min(max(score, 0.0), 1.0)
