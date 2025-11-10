from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..dependencies.auth import get_current_active_user
from ..dependencies.database import get_db
from ..models.favorite import FavoriteCreate, FavoritePublic
from ..models.user import UserInDB
from ..services import favorite_service

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("", response_model=list[FavoritePublic])
async def list_favorites(
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> list[FavoritePublic]:
    return await favorite_service.list_favorites(db, str(current_user.id))


@router.post("", response_model=FavoritePublic, status_code=status.HTTP_201_CREATED)
async def add_favorite(
    payload: FavoriteCreate,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> FavoritePublic:
    return await favorite_service.add_favorite(db, str(current_user.id), payload)


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response, response_model=None)
async def remove_favorite(
    vehicle_id: str,
    current_user: UserInDB = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> Response:
    await favorite_service.remove_favorite(db, str(current_user.id), vehicle_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
