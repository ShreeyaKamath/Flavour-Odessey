from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.models import User
from app.schemas.contracts import (
    ErrorResponse,
    GameStateResponse,
    RecipeCraftRequest,
    RecipesResponse,
)
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/recipes", tags=["recipes"])
RECIPE_RESPONSES = {
    401: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


@router.get(
    "",
    operation_id="get_recipes",
    response_model=RecipesResponse,
    responses=RECIPE_RESPONSES,
)
async def get_recipes(
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> RecipesResponse:
    return await gameplay.get_recipes(current_user.id)


@router.post(
    "/craft",
    operation_id="craft_recipe",
    response_model=GameStateResponse,
    responses=RECIPE_RESPONSES,
)
async def craft_recipe(
    payload: RecipeCraftRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.craft_recipe(current_user.id, payload.recipe_id)
