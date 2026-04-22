import os
from dataclasses import dataclass


@dataclass
class Settings:
    app_name: str = "Hybrid Incident Response Agent (HIRA)"
    app_version: str = "1.3.0"
    cors_origins: list[str] = None

    def __post_init__(self) -> None:
        raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
        if not origins:
            raise ValueError("CORS_ORIGINS cannot be empty")
        self.cors_origins = origins


def get_settings() -> Settings:
    return Settings()
