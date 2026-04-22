import pytest

pytest.importorskip("fastapi")
pytest.importorskip("networkx")

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "version" in response.json()


def test_normal_scenario():
    payload = {
        "fire_detected": False,
        "smoke_level": 1,
        "people_inside": 3,
        "exits_blocked": [],
        "sprinkler_working": True,
        "location": "RoomA",
    }
    response = client.post("/incident", json=payload)
    assert response.status_code == 200
    assert response.headers.get("X-Request-ID")
    body = response.json()
    assert body["incident_type"] in ["NORMAL", "UNKNOWN"]
    assert body["decision"] in ["MONITOR", "EVACUATE"]
    assert "decision_metadata" in body
    assert "explanation_details" in body


def test_fire_emergency():
    payload = {
        "fire_detected": True,
        "smoke_level": 9,
        "people_inside": 20,
        "exits_blocked": ["Exit2"],
        "sprinkler_working": False,
        "location": "RoomA",
        "planning_algorithm": "astar",
        "node_smoke_levels": {"Hall1": 9},
    }
    response = client.post("/incident", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["incident_type"] == "FIRE"
    assert "HIGH_SMOKE" in body["risks"]
    assert body["decision"] in ["EVACUATE", "CALL_FIRE_DEPT"]


def test_all_exits_blocked_edge_case():
    payload = {
        "fire_detected": True,
        "smoke_level": 8,
        "people_inside": 12,
        "exits_blocked": ["Exit1", "Exit2", "Exit3"],
        "sprinkler_working": False,
        "location": "RoomA",
    }
    response = client.post("/incident", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["evacuation_path"] == []
    assert "BLOCKED_EXIT" in body["risks"]


def test_invalid_location_returns_structured_error():
    payload = {
        "fire_detected": True,
        "smoke_level": 9,
        "people_inside": 20,
        "exits_blocked": [],
        "sprinkler_working": False,
        "location": "InvalidRoom",
    }
    response = client.post("/incident", json=payload)
    assert response.status_code == 422
    assert response.json()["error"]["type"] == "http_error"
