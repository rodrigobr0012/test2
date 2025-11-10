from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import settings

_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri, uuidRepresentation="standard")
    return _client


def get_database() -> AsyncIOMotorDatabase:
    client = get_client()
    return client[settings.mongodb_db]


async def close_client() -> None:
    global _client
    if _client is not None:
        _client.close()
        _client = None


@asynccontextmanager
async def lifespan(app):  # type: ignore[override]
    client = get_client()
    db = client[settings.mongodb_db]
    await ensure_indexes(db)
    try:
        yield
    finally:  # pragma: no cover - defensive cleanup
        await close_client()


async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index("email", unique=True)
    await db.users.create_index("document", unique=False, sparse=True)
    await db.vehicles.create_index([("brand", 1)])
    await db.vehicles.create_index([("model", 1)])
    await db.vehicles.create_index([("location", 1)])
    await db.vehicles.create_index([("price", 1)])
    await db.favorites.create_index([("user_id", 1), ("vehicle_id", 1)], unique=True)
