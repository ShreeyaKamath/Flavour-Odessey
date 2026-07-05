from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.models import User
from app.schemas.contracts import (
    ErrorResponse,
    GameStateResponse,
    QuestCompleteRequest,
    QuestProgressRequest,
    QuestsResponse,
    QuestStartRequest,
)
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/quests", tags=["quests"])
QUEST_RESPONSES = {
    401: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.get(
    "",
    operation_id="get_quests",
    response_model=QuestsResponse,
    responses=QUEST_RESPONSES,
)
async def get_quests(
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> QuestsResponse:
    return await gameplay.get_quests(current_user.id)


@router.post(
    "/start",
    operation_id="start_quest",
    response_model=GameStateResponse,
    responses=QUEST_RESPONSES,
)
async def start_quest(
    payload: QuestStartRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.start_quest(current_user.id, payload.quest_id)


@router.post(
    "/progress",
    operation_id="update_quest_progress",
    response_model=GameStateResponse,
    responses=QUEST_RESPONSES,
)
async def update_progress(
    payload: QuestProgressRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.update_quest_progress(current_user.id, payload.quest_id)


@router.post(
    "/complete",
    operation_id="complete_quest",
    response_model=GameStateResponse,
    responses=QUEST_RESPONSES,
)
async def complete_quest(
    payload: QuestCompleteRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.complete_quest(current_user.id, payload.quest_id)
