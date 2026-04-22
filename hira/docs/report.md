# Project Report: Hybrid Incident Response Agent (HIRA)

## Problem Statement
Emergency response requires fast, explainable, and safety-first decisions under uncertainty.

## Approach
HIRA combines symbolic AI and search/planning:
- Rule-based detection and reasoning for transparent logic.
- Graph search (BFS, A*) for routing.
- Utility scoring for action prioritization.
- Explainable output for human trust.

## Results
The system returns:
- Incident classification.
- Risk inventory.
- Ranked action scores and selected action.
- Safe evacuation path when available.
- Human-readable explanation.

## Future Scope
- True Bayesian network for probability propagation.
- Real-time WebSocket push notifications.
- Multi-agent coordination and simulation.
- Rich graph animation and digital twin integration.
