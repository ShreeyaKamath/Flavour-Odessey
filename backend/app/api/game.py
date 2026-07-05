from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.models import User
from app.schemas.contracts import ErrorResponse, GameStartRequest, GameStateResponse
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/game", tags=["game"])
GAME_RESPONSES = {
    401: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.get(
    "/state",
    operation_id="get_game_state",
    response_model=GameStateResponse,
    responses=GAME_RESPONSES,
)
async def get_state(
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.get_state(current_user.id)


@router.post(
    "/start",
    operation_id="start_game",
    response_model=GameStateResponse,
    responses=GAME_RESPONSES,
)
async def start_game(
    payload: GameStartRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.start_game(current_user.id, payload.island_id)
