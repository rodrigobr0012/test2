from __future__ import annotations

from datetime import datetime

from pydantic import Field

from ..utils.object_id import MongoBaseModel, PyObjectId
from .vehicle import VehiclePublic


class FavoriteCreate(MongoBaseModel):
    vehicle_id: str


class FavoriteInDB(MongoBaseModel):
    id: PyObjectId | None = Field(default=None, alias="_id")
    user_id: PyObjectId
    vehicle_id: PyObjectId
    created_at: datetime


class FavoritePublic(MongoBaseModel):
    id: str
    vehicle_id: str
    created_at: datetime
    vehicle: VehiclePublic | None = None
