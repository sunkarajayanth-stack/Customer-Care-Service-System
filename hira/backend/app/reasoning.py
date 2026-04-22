from typing import List

from app.models import IncidentState


def infer_risks(state: IncidentState) -> List[str]:
    risks: List[str] = []

    if state.smoke_level >= 7:
        risks.append("HIGH_SMOKE")
    elif state.smoke_level >= 4:
        risks.append("MEDIUM_SMOKE")

    if state.fire_detected:
        risks.append("ACTIVE_FIRE")

    if state.exits_blocked:
        risks.append("BLOCKED_EXIT")

    if not state.sprinkler_working:
        risks.append("FIRE_SPREAD")

    if state.people_inside > 10:
        risks.append("HIGH_OCCUPANCY")

    if state.location in state.blocked_nodes:
        risks.append("CURRENT_LOCATION_BLOCKED")

    if not risks:
        risks.append("LOW_RISK")

    return risks
