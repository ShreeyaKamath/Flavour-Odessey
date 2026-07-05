from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.services.gameplay import GameplayService


def get_gameplay_service(
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> GameplayService:
    return GameplayService(session)
