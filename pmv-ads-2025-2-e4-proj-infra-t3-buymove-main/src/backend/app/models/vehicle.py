from __future__ import annotations

from datetime import datetime
from typing import List

from pydantic import Field

from ..utils.object_id import MongoBaseModel, PyObjectId


class VehicleBase(MongoBaseModel):
    title: str
    brand: str
    model: str
    version: str | None = None
    year: int
    price: float
    mileage: int
    color: str | None = None
    fuel_type: str | None = None
    transmission: str | None = None
    doors: int | None = None
    location: str | None = None
    description: str | None = None
    images: List[str] = Field(default_factory=list)
    features: List[str] = Field(default_factory=list)


class VehicleCreate(VehicleBase):
    seller_id: str | None = None


class VehicleUpdate(MongoBaseModel):
    title: str | None = None
    brand: str | None = None
    model: str | None = None
    version: str | None = None
    year: int | None = None
    price: float | None = None
    mileage: int | None = None
    color: str | None = None
    fuel_type: str | None = None
    transmission: str | None = None
    doors: int | None = None
    location: str | None = None
    description: str | None = None
    images: List[str] | None = None
    features: List[str] | None = None


class VehicleInDB(VehicleBase):
    id: PyObjectId | None = Field(default=None, alias="_id")
    seller_id: PyObjectId | None = None
    created_at: datetime
    updated_at: datetime


class VehiclePublic(VehicleBase):
    id: str
    seller_id: str | None = None
    created_at: datetime
    updated_at: datetime


class VehicleListResponse(MongoBaseModel):
    items: List[VehiclePublic]
    total: int
