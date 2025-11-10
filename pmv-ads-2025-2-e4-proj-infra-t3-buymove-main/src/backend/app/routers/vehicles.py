from __future__ import annotations

from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..dependencies.auth import get_current_active_user
from ..dependencies.database import get_db
from ..models.user import UserInDB
from ..models.vehicle import VehicleCreate, VehicleListResponse, VehiclePublic, VehicleUpdate
from ..services import vehicle_service

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


@router.get("", response_model=VehicleListResponse)
async def list_vehicles(
    q: Optional[str] = Query(default=None, description="Busca por texto"),
    brand: Optional[str] = Query(default=None),
    color: Optional[str] = Query(default=None),
    doors: Optional[int] = Query(default=None, ge=2, le=6),
    location: Optional[str] = Query(default=None),
    min_price: Optional[float] = Query(default=None, ge=0),
    max_price: Optional[float] = Query(default=None, ge=0),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=60),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> VehicleListResponse:
    items, total = await vehicle_service.list_vehicles(
        db,
        q=q,
        brand=brand,
        color=color,
        doors=doors,
        location=location,
        min_price=min_price,
        max_price=max_price,
        page=page,
        page_size=page_size,
    )
    return VehicleListResponse(items=items, total=total)


@router.get("/{vehicle_id}", response_model=VehiclePublic)
async def get_vehicle(vehicle_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> VehiclePublic:
    return await vehicle_service.get_vehicle(db, vehicle_id)


@router.post("", response_model=VehiclePublic, status_code=status.HTTP_201_CREATED)
async def create_vehicle(
    payload: VehicleCreate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> VehiclePublic:
    owner_id = str(current_user.id) if current_user.id else None
    return await vehicle_service.create_vehicle(db, payload, owner_id=owner_id)


@router.patch("/{vehicle_id}", response_model=VehiclePublic)
async def update_vehicle(
    vehicle_id: str,
    payload: VehicleUpdate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> VehiclePublic:
    await ensure_vehicle_permission(db, vehicle_id, current_user)
    return await vehicle_service.update_vehicle(db, vehicle_id, payload)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response, response_model=None)
async def delete_vehicle(
    vehicle_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> Response:
    await ensure_vehicle_permission(db, vehicle_id, current_user)
    await vehicle_service.delete_vehicle(db, vehicle_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{vehicle_id}/recommendations", response_model=list[VehiclePublic])
async def fetch_recommendations(vehicle_id: str, db: AsyncIOMotorDatabase = Depends(get_db)) -> list[VehiclePublic]:
    return await vehicle_service.get_recommendations(db, vehicle_id)


async def ensure_vehicle_permission(db: AsyncIOMotorDatabase, vehicle_id: str, user: UserInDB) -> None:
    """Validate that the user can mutate the vehicle."""
    if not ObjectId.is_valid(vehicle_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Identificador invalido")

    vehicle = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Veiculo nao encontrado")

    seller_id = vehicle.get("seller_id")
    is_admin = "admin" in user.roles
    if seller_id is None or is_admin:
        return

    if not user.id or str(seller_id) != str(user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sem permissao")
