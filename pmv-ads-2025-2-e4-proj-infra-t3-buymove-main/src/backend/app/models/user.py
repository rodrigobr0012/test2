from __future__ import annotations

from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr, Field

from ..utils.object_id import MongoBaseModel, PyObjectId


class UserBase(MongoBaseModel):
    email: EmailStr
    full_name: str | None = None
    phone: str | None = None
    document: str | None = Field(default=None, description="CPF ou CNPJ")
    roles: List[str] = Field(default_factory=lambda: ["customer"])


class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserUpdate(MongoBaseModel):
    full_name: str | None = None
    phone: str | None = None
    password: str | None = Field(default=None, min_length=8)


class UserInDB(UserBase):
    id: PyObjectId | None = Field(default=None, alias="_id")
    hashed_password: str
    created_at: datetime
    updated_at: datetime


class UserPublic(UserBase):
    id: str = Field(alias="id")
    created_at: datetime
    updated_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int
