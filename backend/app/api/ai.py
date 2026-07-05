from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ai.providers import FutureLLMProvider, create_llm_provider
from app.api.dependencies import get_current_user
from app.core.config import settings
from app.db.session import get_async_session
from app.models import User
from app.schemas.contracts import (
    AICompanionRespondRequest,
    AICompanionRespondResponse,
    AIJournalStoryRequest,
    AIJournalStoryResponse,
    AINpcChatRequest,
    AINpcChatResponse,
    AIRecipeDescribeRequest,
    AIRecipeDescribeResponse,
    ErrorResponse,
)
from app.services.ai import AIService


router = APIRouter(prefix="/api/ai", tags=["ai"])
AI_RESPONSES = {
    401: {"model": ErrorResponse},
    404: {"model": ErrorResponse},
    409: {"model": ErrorResponse},
    422: {"model": ErrorResponse},
}


def get_ai_provider() -> FutureLLMProvider:
    return create_llm_provider(
        settings.ai_provider,
        deterministic=settings.ai_deterministic,
    )


def get_ai_service(
    session: Annotated[AsyncSession, Depends(get_async_session)],
    provider: Annotated[FutureLLMProvider, Depends(get_ai_provider)],
) -> AIService:
    return AIService(session, provider, settings)


@router.post(
    "/npc/chat",
    operation_id="ai_npc_chat",
    response_model=AINpcChatResponse,
    responses=AI_RESPONSES,
)
async def npc_chat(
    payload: AINpcChatRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AINpcChatResponse:
    return await service.npc_chat(
        current_user.id,
        payload.npc_id,
        payload.message,
    )


@router.post(
    "/companion/respond",
    operation_id="ai_companion_respond",
    response_model=AICompanionRespondResponse,
    responses=AI_RESPONSES,
)
async def companion_respond(
    payload: AICompanionRespondRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AICompanionRespondResponse:
    return await service.companion_response(current_user.id, payload.event)


@router.post(
    "/recipe/describe",
    operation_id="ai_recipe_describe",
    response_model=AIRecipeDescribeResponse,
    responses=AI_RESPONSES,
)
async def recipe_describe(
    payload: AIRecipeDescribeRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIRecipeDescribeResponse:
    return await service.describe_recipe(current_user.id, payload.recipe_id)


@router.post(
    "/journal/story",
    operation_id="ai_journal_story",
    response_model=AIJournalStoryResponse,
    responses=AI_RESPONSES,
)
async def journal_story(
    payload: AIJournalStoryRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    service: Annotated[AIService, Depends(get_ai_service)],
) -> AIJournalStoryResponse:
    return await service.journal_story(current_user.id, payload.island_id)
