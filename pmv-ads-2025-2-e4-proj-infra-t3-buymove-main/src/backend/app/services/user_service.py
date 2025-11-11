from __future__ import annotations

from datetime import datetime, timezone

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.security import hash_password, verify_password
from ..models.user import UserCreate, UserInDB, UserPublic
from ..utils.object_id import object_id_to_str


async def create_user(db: AsyncIOMotorDatabase, payload: UserCreate) -> UserPublic:
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="E-mail já cadastrado")

    now = datetime.now(timezone.utc)
    document = payload.model_dump()
    password = document.pop("password")
    document.update(
        {
            "email": payload.email.lower(),
            "hashed_password": hash_password(password),
            "created_at": now,
            "updated_at": now,
        }
    )

    result = await db.users.insert_one(document)
    stored = await db.users.find_one({"_id": result.inserted_id})
    return serialize_user(stored)


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str) -> UserInDB | None:
    raw = await db.users.find_one({"email": email.lower()})
    if not raw:
        return None

    # 👇 converte o ObjectId para string antes de validar
    if "_id" in raw and isinstance(raw["_id"], ObjectId):
        raw["_id"] = str(raw["_id"])

    return UserInDB.model_validate(raw)


async def get_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> UserInDB | None:
    if not ObjectId.is_valid(user_id):
        return None

    raw = await db.users.find_one({"_id": ObjectId(user_id)})
    if not raw:
        return None

    # 👇 mesma coisa aqui
    if "_id" in raw and isinstance(raw["_id"], ObjectId):
        raw["_id"] = str(raw["_id"])

    return UserInDB.model_validate(raw)


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str) -> UserInDB | None:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def serialize_user(document: dict | None) -> UserPublic:
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")
    data = object_id_to_str(document)
    data.pop("hashed_password", None)
    return UserPublic.model_validate(data)


def user_to_public(user: UserInDB) -> UserPublic:
    data = user.model_dump(by_alias=True)
    data.pop("hashed_password", None)
    data = object_id_to_str(data)
    return UserPublic.model_validate(data)
