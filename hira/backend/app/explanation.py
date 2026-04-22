from typing import List, Tuple

from app.models import ActionType, ExplanationDetails, IncidentState


def generate_explanation(
    state: IncidentState,
    risks: List[str],
    decision: ActionType,
    path: List[str],
    probability_of_fire: float,
) -> Tuple[str, ExplanationDetails]:
    summary = f"{decision} recommended with fire probability {probability_of_fire:.2f}."

    key_factors = [
        f"Smoke level: {state.smoke_level}/10",
        f"Fire sensor: {'ON' if state.fire_detected else 'OFF'}",
        f"Blocked exits: {', '.join(state.exits_blocked) if state.exits_blocked else 'None'}",
        f"Sprinkler: {'Working' if state.sprinkler_working else 'Not working'}",
        f"People inside: {state.people_inside}",
    ]

    reasoning_steps = [
        "1) Detect incident from sensor and smoke signals.",
        f"2) Infer risks: {', '.join(risks)}.",
        "3) Plan safest available path while avoiding blocked nodes.",
        f"4) Score actions via utility policy and choose highest priority action: {decision}.",
    ]

    path_text = " -> ".join(path) if path else "No safe route currently available"
    final_justification = f"Chosen action: {decision}. Planned path: {path_text}."

    details = ExplanationDetails(
        summary=summary,
        key_factors=key_factors,
        reasoning_steps=reasoning_steps,
        final_justification=final_justification,
    )

    text = (
        f"Summary: {summary}\n"
        f"Key factors: {' | '.join(key_factors)}\n"
        f"Reasoning: {' '.join(reasoning_steps)}\n"
        f"Final justification: {final_justification}"
    )

    return text, details
