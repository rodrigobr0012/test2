from __future__ import annotations

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from motor.motor_asyncio import AsyncIOMotorDatabase

from ..core.security import credentials_exception, decode_token
from ..models.user import UserInDB
from ..services import user_service
from .database import get_db


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> UserInDB:
    if not token:
        raise credentials_exception()
    subject = decode_token(token)
    user = await user_service.get_user_by_id(db, subject)
    if not user:
        raise credentials_exception()
    return user


async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)) -> UserInDB:
    return current_user
