import json
import math
from pathlib import Path
from typing import Dict, List, Tuple

import networkx as nx


DATA_PATH = Path(__file__).parent / "data" / "building_map.json"
NODE_POSITIONS = {
    "RoomA": (0, 0),
    "RoomB": (1, 0),
    "Hall1": (1, 1),
    "Stairs1": (2, 2),
    "Floor2Hall": (3, 2),
    "RoomC": (4, 2),
    "Exit1": (0, 2),
    "Exit2": (2, 1),
    "Exit3": (4, 3),
}


def load_building_map() -> Dict[str, List[str]]:
    with DATA_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def build_graph(map_data: Dict[str, List[str]]) -> nx.Graph:
    graph = nx.Graph()
    for node, neighbors in map_data.items():
        graph.add_node(node)
        for neighbor in neighbors:
            graph.add_edge(node, neighbor, weight=1)
    return graph


def _remove_unsafe_nodes(graph: nx.Graph, blocked_nodes: List[str]) -> nx.Graph:
    safe_graph = graph.copy()
    for node in blocked_nodes:
        if node in safe_graph:
            safe_graph.remove_node(node)
    return safe_graph


def _distance_heuristic(current: str, target: str) -> float:
    c = NODE_POSITIONS.get(current)
    t = NODE_POSITIONS.get(target)
    if not c or not t:
        return 1.0
    return math.dist(c, t)


def find_exit_path(
    start: str,
    exits: List[str],
    blocked_nodes: List[str],
    node_smoke_levels: Dict[str, int] | None = None,
    smoke_weight: float = 0.15,
    blocked_penalty: float = 5.0,
    algorithm: str = "astar",
) -> Tuple[List[str], str]:
    map_data = load_building_map()
    graph = build_graph(map_data)
    safe_graph = _remove_unsafe_nodes(graph, blocked_nodes)
    smoke_map = node_smoke_levels or {}

    if start not in safe_graph:
        return [], algorithm

    available_exits = [e for e in exits if e in safe_graph]
    if not available_exits:
        return [], algorithm

    def weighted_cost(u: str, v: str, attrs: Dict[str, float]) -> float:
        distance = attrs.get("weight", 1.0)
        smoke_penalty = smoke_weight * ((smoke_map.get(u, 0) + smoke_map.get(v, 0)) / 2)
        blocked_cost = blocked_penalty if (u in blocked_nodes or v in blocked_nodes) else 0
        return distance + smoke_penalty + blocked_cost

    best_path: List[str] = []

    if algorithm == "bfs":
        shortest_len = float("inf")
        for exit_node in available_exits:
            try:
                path = nx.shortest_path(safe_graph, source=start, target=exit_node)
                if len(path) < shortest_len:
                    shortest_len = len(path)
                    best_path = path
            except nx.NetworkXNoPath:
                continue
    else:
        shortest_cost = float("inf")
        for exit_node in available_exits:
            try:
                path = nx.astar_path(
                    safe_graph,
                    source=start,
                    target=exit_node,
                    heuristic=lambda a, b: _distance_heuristic(a, b),
                    weight=weighted_cost,
                )
                cost = nx.path_weight(safe_graph, path, weight=weighted_cost)
                if cost < shortest_cost:
                    shortest_cost = cost
                    best_path = path
            except nx.NetworkXNoPath:
                continue

    return best_path, algorithm
