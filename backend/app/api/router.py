from fastapi import APIRouter

from app.api.ai import router as ai_router
from app.api.auth import router as auth_router
from app.api.game import router as game_router
from app.api.inventory import router as inventory_router
from app.api.journal import router as journal_router
from app.api.npcs import router as npcs_router
from app.api.quests import router as quests_router
from app.api.recipes import router as recipes_router
from app.api.world import router as world_router
from app.core.config import settings
from app.schemas.contracts import HealthResponse


api_router = APIRouter()
api_router.include_router(ai_router)
api_router.include_router(auth_router)
api_router.include_router(world_router)
api_router.include_router(game_router)
api_router.include_router(inventory_router)
api_router.include_router(quests_router)
api_router.include_router(recipes_router)
api_router.include_router(journal_router)
api_router.include_router(npcs_router)


@api_router.get(
    "/health",
    operation_id="get_health",
    response_model=HealthResponse,
    tags=["health"],
)
async def health_check() -> HealthResponse:
    return HealthResponse(status="ok", service=settings.service_name)
