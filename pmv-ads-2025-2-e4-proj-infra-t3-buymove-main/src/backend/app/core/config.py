from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, List

from pydantic import Field
from pydantic import SecretStr
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
SRC_DIR = BACKEND_DIR.parent
REPO_ROOT = SRC_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=tuple(
            str(path)
            for path in (
                Path(".env"),
                BACKEND_DIR / ".env",
                SRC_DIR / ".env",
                REPO_ROOT / ".env",
            )
        ),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    app_name: str = Field(default="buyMove API")
    environment: str = Field(default="development")
    mongodb_uri: str = Field(default="mongodb://localhost:27017", alias="MONGODB_URI")
    mongodb_db: str = Field(default="buymove", alias="MONGODB_DB")
    jwt_secret: SecretStr = Field(default=SecretStr("change-me"), alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60 * 24, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    cors_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
            "http://localhost:19006",
        ],
        alias="CORS_ORIGINS",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Any) -> List[str]:
        """Normalize CORS origins declared through environment variables."""

        if value is None or value == "":
            return []

        if isinstance(value, str):
            value = value.strip()
            if value.startswith("["):
                try:
                    parsed = json.loads(value)
                except json.JSONDecodeError as exc:  # pragma: no cover - defensive
                    raise ValueError("Invalid JSON array for CORS_ORIGINS") from exc
                if isinstance(parsed, list):
                    return [str(origin).strip() for origin in parsed if str(origin).strip()]
                raise ValueError("CORS_ORIGINS JSON must be an array of origins")

            return [origin.strip() for origin in value.split(",") if origin.strip()]

        if isinstance(value, (list, tuple, set)):
            return [str(origin).strip() for origin in value if str(origin).strip()]

        raise TypeError("CORS_ORIGINS must be a list or comma separated string")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
