from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from .config import settings

# Cliente global reutilizado pela aplicação inteira
_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    """
    Retorna o cliente MongoDB global.
    Se ainda não existir, cria usando a URI do .env.
    """
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(
            settings.mongodb_uri,
            uuidRepresentation="standard",
        )
    return _client


def get_database() -> AsyncIOMotorDatabase:
    """
    Retorna a instância do banco configurado em MONGODB_DB.
    """
    client = get_client()
    return client[settings.mongodb_db]


async def close_client() -> None:
    """
    Fecha o cliente global do MongoDB.
    """
    global _client
    if _client is not None:
        _client.close()
        _client = None


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:  # type: ignore[override]
    """
    Função de lifespan usada no FastAPI.

    - Inicializa o client do MongoDB usando MONGODB_URI
    - Faz um ping para testar a conexão
    - Garante criação dos índices
    - Fecha o client ao encerrar a aplicação
    """
    client = get_client()
    db = client[settings.mongodb_db]

    # (Opcional mas útil) testar conexão com o banco
    try:
        await db.command("ping")
        print(f"✅ Conectado ao MongoDB: {settings.mongodb_uri}, db={settings.mongodb_db}")
    except Exception as exc:  # noqa: BLE001
        print("❌ Erro ao conectar ao MongoDB:", repr(exc))

    # Garante que os índices necessários existem
    await ensure_indexes(db)

    # Se você quiser usar request.app.state.db em dependências, pode expor aqui:
    app.state.db = db  # opcional, mas conveniente

    try:
        yield
    finally:  # pragma: no cover - defensive cleanup
        await close_client()


async def ensure_indexes(db: AsyncIOMotorDatabase) -> None:
    """
    Cria índices importantes nas coleções usadas pela aplicação.
    Executa de forma idempotente (criar índice que já existe não quebra).
    """
    await db.users.create_index("email", unique=True)
    await db.users.create_index("document", unique=False, sparse=True)

    await db.vehicles.create_index([("brand", 1)])
    await db.vehicles.create_index([("model", 1)])
    await db.vehicles.create_index([("location", 1)])
    await db.vehicles.create_index([("price", 1)])

    await db.favorites.create_index(
        [("user_id", 1), ("vehicle_id", 1)],
        unique=True,
    )
