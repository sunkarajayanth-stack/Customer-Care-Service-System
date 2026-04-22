from pathlib import Path


def test_project_layout_smoke():
    assert Path('app/main.py').exists()
    assert Path('app/data/building_map.json').exists()
