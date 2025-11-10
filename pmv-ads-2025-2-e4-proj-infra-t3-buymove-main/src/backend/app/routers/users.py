from __future__ import annotations

from fastapi import APIRouter, Depends

from ..dependencies.auth import get_current_active_user
from ..models.user import UserInDB, UserPublic
from ..services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
async def read_profile(current_user: UserInDB = Depends(get_current_active_user)) -> UserPublic:
    return user_service.user_to_public(current_user)
