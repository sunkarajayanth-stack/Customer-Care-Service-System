# Algorithms

## 1) Rule-Based Inference
The reasoning module uses threshold and boolean rules over smoke, fire sensor, blocked exits, sprinkler status, and occupancy.

## 2) BFS Path Search
BFS finds shortest unweighted path from start location to each exit in a pruned graph where blocked nodes are removed.

## 3) A* Path Search
A* is implemented through `networkx.astar_path` with uniform edge weight and a lightweight heuristic. It returns efficient shortest path candidates.

## 4) Utility-Based Decision Theory
Each action has weighted risk contributions. The action with highest aggregate utility score is selected.

Actions:
- EVACUATE
- CALL_FIRE_DEPT
- ACTIVATE_SPRINKLER
- MONITOR

## 5) Optional Probabilistic Signal
A bounded score approximates fire probability from multiple sensors/conditions and is exposed in API response.
