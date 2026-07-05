from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.models import User
from app.schemas.contracts import (
    ErrorResponse,
    GameStateResponse,
    JournalCreateRequest,
    JournalResponse,
)
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/journal", tags=["journal"])
JOURNAL_RESPONSES = {
    401: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.get(
    "",
    operation_id="get_journal",
    response_model=JournalResponse,
    responses=JOURNAL_RESPONSES,
)
async def get_journal(
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> JournalResponse:
    return await gameplay.get_journal(current_user.id)


@router.post(
    "/create",
    operation_id="create_journal_entry",
    response_model=GameStateResponse,
    responses=JOURNAL_RESPONSES,
)
async def create_entry(
    payload: JournalCreateRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.create_journal_entry(current_user.id, payload.island_id)
