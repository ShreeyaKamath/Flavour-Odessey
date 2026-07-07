from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.session import get_async_session
from app.models import User
from app.schemas.contracts import ErrorResponse, NpcGiftRequest, NpcGiftResponse, NpcStateResponse, NpcsResponse
from app.services.npc import NPCService


router = APIRouter(prefix="/api/npcs", tags=["npcs"])
NPC_RESPONSES = {
    401: {"model": ErrorResponse},
    404: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


def get_npc_service(
    session: Annotated[AsyncSession, Depends(get_async_session)],
) -> NPCService:
    return NPCService(session)


@router.get(
    "",
    operation_id="list_npcs",
    response_model=NpcsResponse,
    responses=NPC_RESPONSES,
)
async def list_npcs(
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NPCService, Depends(get_npc_service)],
) -> NpcsResponse:
    return await service.list_npcs(current_user.id)


@router.get(
    "/{npc_id}",
    operation_id="get_npc",
    response_model=NpcStateResponse,
    responses=NPC_RESPONSES,
)
async def get_npc(
    npc_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NPCService, Depends(get_npc_service)],
) -> NpcStateResponse:
    return await service.get_npc(current_user.id, npc_id)


@router.post(
    "/{npc_id}/gift",
    operation_id="give_npc_gift",
    response_model=NpcGiftResponse,
    responses=NPC_RESPONSES,
)
async def give_npc_gift(
    npc_id: str,
    payload: NpcGiftRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[NPCService, Depends(get_npc_service)],
) -> NpcGiftResponse:
    return await service.give_placeholder_gift(current_user.id, npc_id, payload.gift_id)
