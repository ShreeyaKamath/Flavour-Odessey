from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.api.gameplay_dependencies import get_gameplay_service
from app.db.session import get_async_session
from app.models import User
from app.schemas.contracts import (
    ErrorResponse,
    GameStateResponse,
    IslandSummary,
    IslandsResponse,
    WeatherResponse,
    WorldEventsResponse,
    WorldResponse,
)
from app.services.world import WorldService
from app.services.gameplay import GameplayService


router = APIRouter(prefix="/api/world", tags=["world"])
PROTECTED_RESPONSES = {401: {"model": ErrorResponse}}


def get_world_service(
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> WorldService:
    return WorldService(session)


@router.get(
    "",
    operation_id="get_world",
    response_model=WorldResponse,
    responses=PROTECTED_RESPONSES,
)
async def get_world(
    current_user: Annotated[User, Depends(get_current_user)],
    world_service: Annotated[WorldService, Depends(get_world_service)],
) -> WorldResponse:
    return await world_service.get_world(current_user.id)


@router.get(
    "/islands",
    operation_id="list_world_islands",
    response_model=IslandsResponse,
    responses=PROTECTED_RESPONSES,
)
async def list_islands(
    current_user: Annotated[User, Depends(get_current_user)],
    world_service: Annotated[WorldService, Depends(get_world_service)],
) -> IslandsResponse:
    return await world_service.get_islands(current_user.id)


@router.get(
    "/islands/{island_id}",
    operation_id="get_world_island",
    response_model=IslandSummary,
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
    },
)
async def get_island(
    island_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    world_service: Annotated[WorldService, Depends(get_world_service)],
) -> IslandSummary:
    return await world_service.get_island(current_user.id, island_id)


@router.post(
    "/islands/{island_id}/restore",
    operation_id="restore_world_island",
    response_model=GameStateResponse,
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        409: {"model": ErrorResponse},
    },
)
async def restore_island(
    island_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    gameplay: Annotated[GameplayService, Depends(get_gameplay_service)],
) -> GameStateResponse:
    return await gameplay.restore_island(current_user.id, island_id)


@router.get(
    "/weather",
    operation_id="get_world_weather",
    response_model=WeatherResponse,
    responses=PROTECTED_RESPONSES,
)
async def get_weather(
    current_user: Annotated[User, Depends(get_current_user)],
    world_service: Annotated[WorldService, Depends(get_world_service)],
) -> WeatherResponse:
    return await world_service.get_weather(current_user.id)


@router.get(
    "/events",
    operation_id="get_world_events",
    response_model=WorldEventsResponse,
    responses=PROTECTED_RESPONSES,
)
async def get_events(
    current_user: Annotated[User, Depends(get_current_user)],
    world_service: Annotated[WorldService, Depends(get_world_service)],
) -> WorldEventsResponse:
    return await world_service.get_events(current_user.id)
