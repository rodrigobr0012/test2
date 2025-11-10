from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.database import get_database


def get_db() -> AsyncIOMotorDatabase:
    return get_database()
