from typing import List, Tuple

from app.models import ActionType, DecisionMetadata, DecisionScore, IncidentState


ACTION_WEIGHTS = {
    ActionType.EVACUATE: {
        "HIGH_SMOKE": 4.0,
        "MEDIUM_SMOKE": 2.5,
        "ACTIVE_FIRE": 5.0,
        "BLOCKED_EXIT": 1.0,
        "HIGH_OCCUPANCY": 2.0,
        "FIRE_SPREAD": 2.0,
        "CURRENT_LOCATION_BLOCKED": 4.0,
    },
    ActionType.CALL_FIRE_DEPT: {
        "ACTIVE_FIRE": 4.5,
        "FIRE_SPREAD": 3.0,
        "HIGH_SMOKE": 2.5,
        "HIGH_OCCUPANCY": 2.0,
    },
    ActionType.ACTIVATE_SPRINKLER: {
        "ACTIVE_FIRE": 3.5,
        "HIGH_SMOKE": 2.5,
        "FIRE_SPREAD": 4.5,
    },
    ActionType.MONITOR: {
        "LOW_RISK": 2.0,
    },
}

ACTION_PRIORITY = [ActionType.EVACUATE, ActionType.CALL_FIRE_DEPT, ActionType.ACTIVATE_SPRINKLER, ActionType.MONITOR]


def score_actions(state: IncidentState, risks: List[str]) -> List[DecisionScore]:
    scores: List[DecisionScore] = []

    for action, weights in ACTION_WEIGHTS.items():
        score = 0.0
        drivers = []
        for risk in risks:
            if risk in weights:
                score += weights[risk]
                drivers.append(risk)

        if action == ActionType.ACTIVATE_SPRINKLER and state.sprinkler_working:
            score -= 1.5
        if action == ActionType.MONITOR and "ACTIVE_FIRE" in risks:
            score -= 5

        rationale = f"Driven by: {', '.join(drivers)}" if drivers else "No strong supporting risk factors"
        scores.append(DecisionScore(action=action, score=score, rationale=rationale))

    scores.sort(key=lambda x: x.score, reverse=True)
    return scores


def _resolve_tie(scores: List[DecisionScore]) -> Tuple[DecisionScore, str | None]:
    if len(scores) < 2:
        return scores[0], None

    top, second = scores[0], scores[1]
    if abs(top.score - second.score) >= 0.5:
        return top, None

    sorted_tie = sorted(
        [top, second],
        key=lambda item: ACTION_PRIORITY.index(item.action),
    )
    winner = sorted_tie[0]
    tie_note = f"Tie between {top.action} and {second.action}; selected {winner.action} by policy priority"
    return winner, tie_note


def build_decision_metadata(scores: List[DecisionScore], chosen: DecisionScore, risks: List[str], tie_break: str | None) -> DecisionMetadata:
    max_score = max(1.0, scores[0].score if scores else 1.0)
    second = scores[1].score if len(scores) > 1 else 0.0
    margin = max(chosen.score - second, 0.0)
    confidence = min(0.99, max(0.2, 0.5 + margin / max_score * 0.5))
    reason = f"{chosen.action} selected due to risks: {', '.join(risks)}"
    return DecisionMetadata(confidence=round(confidence, 2), reason=reason, tie_break=tie_break)


def choose_action(state: IncidentState, risks: List[str]) -> Tuple[List[DecisionScore], DecisionScore, DecisionMetadata]:
    scores = score_actions(state, risks)
    chosen, tie_break = _resolve_tie(scores)
    metadata = build_decision_metadata(scores, chosen, risks, tie_break)
    return scores, chosen, metadata
