from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic import SecretStr
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


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
