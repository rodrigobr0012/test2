from __future__ import annotations

from fastapi import Request
from motor.motor_asyncio import AsyncIOMotorDatabase


def get_db(request: Request) -> AsyncIOMotorDatabase:
    """
    Retorna a instância do banco MongoDB criada no lifespan.
    Assim, o FastAPI reaproveita a conexão em vez de criar uma nova.
    """
    db = getattr(request.app.state, "db", None)

    if db is None:
        raise RuntimeError("Database não inicializado. Verifique o lifespan e a conexão com o MongoDB.")

    return db
