from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.models import User
from app.schemas.contracts import (
    ErrorResponse,
    GameStateResponse,
    InventoryCollectRequest,
    InventoryResponse,
)
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/inventory", tags=["inventory"])
INVENTORY_RESPONSES = {
    401: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.get(
    "",
    operation_id="get_inventory",
    response_model=InventoryResponse,
    responses=INVENTORY_RESPONSES,
)
async def get_inventory(
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> InventoryResponse:
    return await gameplay.get_inventory(current_user.id)


@router.post(
    "/collect",
    operation_id="collect_inventory_ingredient",
    response_model=GameStateResponse,
    responses=INVENTORY_RESPONSES,
)
async def collect_ingredient(
    payload: InventoryCollectRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.collect_ingredient(current_user.id, payload.ingredient_id)
