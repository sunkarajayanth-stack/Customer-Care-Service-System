# Skill: Incident Triage

## Goal
Ensure every incident is processed with valid data, explainable reasoning, and safe evacuation output.

## Checklist
1. Validate payload ranges (`smoke_level` 0-10, non-negative population).
2. Confirm location exists on the building map.
3. Verify inferred risks match the ruleset.
4. Ensure blocked exits are excluded from safe paths.
5. Confirm chosen decision aligns with utility score ranking.
6. Ensure explanation includes sensor state, risk summary, and conclusion.

## Fast Commands
```bash
cd hira/backend
pytest -q
python -m compileall app tests main.py
```
