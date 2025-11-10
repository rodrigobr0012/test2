from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List

from bson import ObjectId
from fastapi import HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from pymongo import ReturnDocument

from ..models.vehicle import VehicleCreate, VehiclePublic, VehicleUpdate
from ..utils.object_id import object_id_to_str


async def list_vehicles(
    db: AsyncIOMotorDatabase,
    *,
    q: str | None = None,
    brand: str | None = None,
    color: str | None = None,
    doors: int | None = None,
    location: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    page: int = 1,
    page_size: int = 12,
) -> tuple[List[VehiclePublic], int]:
    query = build_filters(
        q=q,
        brand=brand,
        color=color,
        doors=doors,
        location=location,
        min_price=min_price,
        max_price=max_price,
    )

    total = await db.vehicles.count_documents(query)
    skip = max(page - 1, 0) * page_size

    cursor = (
        db.vehicles.find(query)
        .sort([("updated_at", -1)])
        .skip(skip)
        .limit(page_size)
    )
    documents = await cursor.to_list(length=page_size)
    items = [serialize_vehicle(doc) for doc in documents]
    return items, total


def build_filters(
    *,
    q: str | None,
    brand: str | None,
    color: str | None,
    doors: int | None,
    location: str | None,
    min_price: float | None,
    max_price: float | None,
) -> Dict[str, Any]:
    clauses: List[Dict[str, Any]] = []

    if q:
        regex = {"$regex": q, "$options": "i"}
        clauses.append({"$or": [{"title": regex}, {"description": regex}, {"brand": regex}, {"model": regex}]})

    if brand:
        clauses.append({"brand": {"$regex": brand, "$options": "i"}})

    if color:
        clauses.append({"color": {"$regex": color, "$options": "i"}})

    if location:
        clauses.append({"location": {"$regex": location, "$options": "i"}})

    if doors is not None:
        clauses.append({"doors": int(doors)})

    price_range: Dict[str, Any] = {}
    if min_price is not None:
        price_range["$gte"] = min_price
    if max_price is not None:
        price_range["$lte"] = max_price
    if price_range:
        clauses.append({"price": price_range})

    if not clauses:
        return {}
    if len(clauses) == 1:
        return clauses[0]
    return {"$and": clauses}


async def get_vehicle(db: AsyncIOMotorDatabase, vehicle_id: str) -> VehiclePublic:
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Identificador inv?lido")
    raw = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not raw:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")
    return serialize_vehicle(raw)


async def create_vehicle(db: AsyncIOMotorDatabase, payload: VehicleCreate, *, owner_id: str | None) -> VehiclePublic:
    now = datetime.now(timezone.utc)
    document = payload.model_dump(exclude_none=True)
    seller_id = owner_id or payload.seller_id
    if seller_id and ObjectId.is_valid(seller_id):
        document["seller_id"] = ObjectId(seller_id)
    document.update({"created_at": now, "updated_at": now})

    result = await db.vehicles.insert_one(document)
    stored = await db.vehicles.find_one({"_id": result.inserted_id})
    return serialize_vehicle(stored)


async def update_vehicle(
    db: AsyncIOMotorDatabase,
    vehicle_id: str,
    payload: VehicleUpdate,
) -> VehiclePublic:
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Identificador inv?lido")

    update_data = payload.model_dump(exclude_none=True)
    if not update_data:
        return await get_vehicle(db, vehicle_id)

    update_data["updated_at"] = datetime.now(timezone.utc)

    result = await db.vehicles.find_one_and_update(
        {"_id": ObjectId(vehicle_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")
    return serialize_vehicle(result)


async def delete_vehicle(db: AsyncIOMotorDatabase, vehicle_id: str) -> None:
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Identificador inv?lido")
    delete_result = await db.vehicles.delete_one({"_id": ObjectId(vehicle_id)})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")


async def get_recommendations(
    db: AsyncIOMotorDatabase,
    vehicle_id: str,
    *,
    limit: int = 6,
) -> List[VehiclePublic]:
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Identificador inv?lido")

    base = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not base:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")

    query: Dict[str, Any] = {"_id": {"$ne": base["_id"]}}
    brand = base.get("brand")
    if brand:
        query["brand"] = brand

    price = base.get("price")
    if isinstance(price, (int, float)):
        margin = max(price * 0.2, 5000)
        query["price"] = {"$gte": max(price - margin, 0), "$lte": price + margin}

    cursor = db.vehicles.find(query).sort([("updated_at", -1)])
    documents = await cursor.to_list(length=limit)

    if len(documents) < limit:
        fallback_cursor = (
            db.vehicles.find({"_id": {"$ne": base["_id"]}})
            .sort([("updated_at", -1)])
            .limit(limit)
        )
        fallback_docs = await fallback_cursor.to_list(length=limit)
        ids = {doc["_id"] for doc in documents}
        documents.extend([doc for doc in fallback_docs if doc["_id"] not in ids])
        documents = documents[:limit]

    return [serialize_vehicle(doc) for doc in documents]


def serialize_vehicle(document: dict | None) -> VehiclePublic:
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ve?culo n?o encontrado")
    data = object_id_to_str(document)
    seller_id = document.get("seller_id")
    if seller_id:
        data["seller_id"] = str(seller_id)
    return VehiclePublic.model_validate(data)
