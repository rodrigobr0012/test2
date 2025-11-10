from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..models.favorite import FavoriteCreate, FavoritePublic
from ..services.vehicle_service import serialize_vehicle
from ..utils.object_id import object_id_to_str


async def add_favorite(db: AsyncIOMotorDatabase, user_id: str, payload: FavoriteCreate) -> FavoritePublic:
    if not ObjectId.is_valid(payload.vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ve?culo inv?lido")

    vehicle = await db.vehicles.find_one({"_id": ObjectId(payload.vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")

    document = {
        "user_id": ObjectId(user_id),
        "vehicle_id": ObjectId(payload.vehicle_id),
        "created_at": datetime.now(timezone.utc),
    }

    existing = await db.favorites.find_one(
        {"user_id": document["user_id"], "vehicle_id": document["vehicle_id"]}
    )
    if existing:
        return serialize_favorite(existing, vehicle)

    result = await db.favorites.insert_one(document)
    stored = await db.favorites.find_one({"_id": result.inserted_id})
    return serialize_favorite(stored, vehicle)


async def list_favorites(db: AsyncIOMotorDatabase, user_id: str) -> List[FavoritePublic]:
    cursor = db.favorites.aggregate(
        [
            {"$match": {"user_id": ObjectId(user_id)}},
            {"$sort": {"created_at": -1}},
            {
                "$lookup": {
                    "from": "vehicles",
                    "localField": "vehicle_id",
                    "foreignField": "_id",
                    "as": "vehicle",
                }
            },
            {"$unwind": {"path": "$vehicle", "preserveNullAndEmptyArrays": True}},
        ]
    )
    documents = await cursor.to_list(length=None)
    return [serialize_favorite(doc, doc.get("vehicle")) for doc in documents]


async def remove_favorite(db: AsyncIOMotorDatabase, user_id: str, vehicle_id: str) -> None:
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ve?culo inv?lido")

    result = await db.favorites.delete_one(
        {"user_id": ObjectId(user_id), "vehicle_id": ObjectId(vehicle_id)}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorito n?o encontrado")


def serialize_favorite(document: dict | None, vehicle_document: dict | None) -> FavoritePublic:
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorito n?o encontrado")
    data = object_id_to_str(document)
    data["vehicle_id"] = str(document["vehicle_id"])
    favorite = FavoritePublic.model_validate(data)
    if vehicle_document:
        favorite.vehicle = serialize_vehicle(vehicle_document)
    return favorite
