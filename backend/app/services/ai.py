from __future__ import annotations

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ai.agents import (
    CompanionAgent,
    MemoryAgent,
    MemoryStore,
    NarrativeHelper,
    NPCAgent,
    RecipeAgent,
)
from ai.orchestrator import AIOrchestrator
from ai.providers import FutureLLMProvider
from ai.schemas import MemoryEntry
from app.core.config import Settings
from app.core.errors import AppError
from app.core.security import utc_now
from app.models import (
    EventLog,
    Island,
    JournalEntry,
    NPC,
    NPCMemory,
    PlayerProfile,
    Quest,
    QuestProgress,
    Recipe,
    WorldState,
)
from app.schemas.contracts import (
    AICompanionRespondResponse,
    AIJournalStoryResponse,
    AINpcChatResponse,
    AIRecipeDescribeResponse,
)
from app.services.npc import NPCService


class SQLAlchemyMemoryStore(MemoryStore):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_memories(
        self,
        player_id: str,
        npc_id: str,
        limit: int,
    ) -> list[MemoryEntry]:
        statement = (
            select(NPCMemory)
            .where(
                NPCMemory.player_profile_id == UUID(player_id),
                NPCMemory.npc_id == UUID(npc_id),
            )
            .order_by(NPCMemory.importance.desc(), NPCMemory.created_at.desc())
            .limit(limit)
        )
        records = (await self.session.execute(statement)).scalars().all()
        return [
            MemoryEntry(
                id=str(record.id),
                player_id=str(record.player_profile_id),
                npc_id=str(record.npc_id),
                content=record.content,
                importance=record.importance,
                memory_type=record.memory_type,
                created_at=record.created_at,
            )
            for record in records
        ]

    async def add_memory(self, entry: MemoryEntry) -> MemoryEntry:
        player_id = UUID(entry.player_id)
        npc_id = UUID(entry.npc_id)
        statement = select(NPCMemory).where(
            NPCMemory.player_profile_id == player_id,
            NPCMemory.npc_id == npc_id,
            NPCMemory.content == entry.content,
        )
        existing = (await self.session.execute(statement)).scalar_one_or_none()
        if existing:
            return MemoryEntry(
                id=str(existing.id),
                player_id=entry.player_id,
                npc_id=entry.npc_id,
                content=existing.content,
                importance=existing.importance,
                memory_type=existing.memory_type,
                created_at=existing.created_at,
            )
        record = NPCMemory(
            player_profile_id=player_id,
            npc_id=npc_id,
            memory_type=entry.memory_type,
            content=entry.content,
            importance=entry.importance,
            extra={"source": "memory_agent"},
        )
        self.session.add(record)
        await self.session.flush()
        return MemoryEntry(
            id=str(record.id),
            player_id=entry.player_id,
            npc_id=entry.npc_id,
            content=entry.content,
            importance=entry.importance,
            memory_type=entry.memory_type,
            created_at=record.created_at,
        )


class AIService:
    def __init__(
        self,
        session: AsyncSession,
        provider: FutureLLMProvider,
        settings: Settings,
    ) -> None:
        self.session = session
        orchestrator = AIOrchestrator(
            provider,
            timeout_seconds=settings.ai_timeout_seconds,
            max_retries=settings.ai_max_retries,
        )
        self.memory = MemoryAgent(SQLAlchemyMemoryStore(session))
        self.npc = NPCAgent(orchestrator)
        self.companion = CompanionAgent(orchestrator)
        self.recipe = RecipeAgent(orchestrator)
        self.narrative = NarrativeHelper(orchestrator)
        self.npcs = NPCService(session)

    async def npc_chat(
        self,
        user_id: UUID,
        npc_key: str,
        player_message: str,
    ) -> AINpcChatResponse:
        profile = await self._started_profile(user_id)
        npc = await self.npcs.get_joy_meadow_npc(npc_key)
        island = await self._joy_meadow()
        status = await self._quest_status(profile.id)
        restored = await self._is_restored(profile.id, island.id)
        dialogue_key = "after_restoration" if restored else "before_restoration"
        fallback = npc.profile.get("dialogue", {}).get(
            dialogue_key,
            "The meadow is listening, Flavor Keeper.",
        )
        memories = await self.memory.read(str(profile.id), str(npc.id))
        generated = await self.npc.respond(
            npc_profile=npc.profile,
            player_message=player_message,
            memories=[memory.content for memory in memories],
            quest_status=status,
            joy_meadow_lore=island.description or "",
            fallback=fallback,
        )
        importance = self.memory.score_importance(player_message)
        written = await self.memory.remember(
            str(profile.id),
            str(npc.id),
            player_message,
        )
        if written:
            self._record_event(
                "NPCMemoryWritten",
                profile.id,
                {"npc_id": npc.key, "importance": written.importance},
            )
        mood = "celebrating" if restored else npc.profile.get("current_mood", "hopeful")
        relationship = await self.npcs.apply_conversation(
            profile,
            npc,
            player_message,
            generated.text,
            mood,
            importance,
        )
        await self.session.commit()
        return AINpcChatResponse(
            npc_id=npc.key,
            reply=generated.text,
            mood=mood,
            memory_written=written is not None,
            importance=importance,
            relationship=relationship,
            provider=generated.provider,
            fallback_used=generated.fallback_used,
        )

    async def companion_response(
        self,
        user_id: UUID,
        event: str,
    ) -> AICompanionRespondResponse:
        profile = await self._started_profile(user_id)
        lumi = await self._npc("lumi")
        island = await self._joy_meadow()
        restored = await self._is_restored(profile.id, island.id)
        status = await self._quest_status(profile.id)
        dialogue_key = "after_restoration" if restored else "before_restoration"
        fallback = lumi.profile.get("dialogue", {}).get(
            dialogue_key,
            "The meadow remembers the way, Flavor Keeper.",
        )
        generated = await self.companion.respond(
            event=event,
            quest_status=status,
            restored=restored,
            fallback=fallback,
        )
        self._record_event(
            "CompanionReacted",
            profile.id,
            {"companion_id": "lumi", "event": event},
        )
        await self.session.commit()
        return AICompanionRespondResponse(
            companion_id="lumi",
            response=generated.text,
            event=event,
            provider=generated.provider,
            fallback_used=generated.fallback_used,
        )

    async def describe_recipe(
        self,
        user_id: UUID,
        recipe_key: str,
    ) -> AIRecipeDescribeResponse:
        await self._started_profile(user_id)
        recipe = await self._recipe_definition(recipe_key)
        ingredients = list(recipe.ingredients)
        generated = await self.recipe.describe(
            name=recipe.name,
            ingredients=ingredients,
            emotion=recipe.emotion,
            canonical_lore=recipe.lore or "",
        )
        return AIRecipeDescribeResponse(
            recipe_id="golden_vanilla_bloom",
            name="Golden Vanilla Bloom",
            lore=generated.text,
            emotion="joy",
            required_ingredients=ingredients,
            provider=generated.provider,
            fallback_used=generated.fallback_used,
        )

    async def journal_story(
        self,
        user_id: UUID,
        island_key: str,
    ) -> AIJournalStoryResponse:
        profile = await self._started_profile(user_id)
        island = await self._joy_meadow()
        if island_key != island.key or not await self._is_restored(
            profile.id,
            island.id,
        ):
            raise AppError(
                "CONFLICT",
                "Restore Joy Meadow before writing its story",
                status_code=409,
            )
        statement = select(JournalEntry).where(
            JournalEntry.player_profile_id == profile.id,
            JournalEntry.island_id == island.id,
            JournalEntry.title == "The Day Joy Returned",
        )
        journal = (await self.session.execute(statement)).scalar_one_or_none()
        if journal is None:
            raise AppError("NOT_FOUND", "Joy Meadow memory not found", status_code=404)
        recipe = await self.session.get(Recipe, journal.recipe_id)
        title, generated = await self.narrative.write_journal_story(
            title=journal.title,
            recipe_name=recipe.name if recipe else "Golden Vanilla Bloom",
            canonical_story=journal.story,
        )
        journal.story = generated.text
        journal.extra = {
            **journal.extra,
            "ai_provider": generated.provider,
            "ai_fallback_used": generated.fallback_used,
        }
        self._record_event(
            "JournalUpdated",
            profile.id,
            {"title": title, "source": generated.provider},
        )
        await self.session.commit()
        return AIJournalStoryResponse(
            island_id="joy_meadow",
            title="The Day Joy Returned",
            story=generated.text,
            provider=generated.provider,
            fallback_used=generated.fallback_used,
        )

    async def _started_profile(self, user_id: UUID) -> PlayerProfile:
        statement = (
            select(PlayerProfile)
            .where(PlayerProfile.user_id == user_id)
            .order_by(PlayerProfile.created_at)
            .limit(1)
        )
        profile = (await self.session.execute(statement)).scalar_one_or_none()
        if profile is None or not profile.progress.get("joy_meadow_started"):
            raise AppError("CONFLICT", "Start Joy Meadow first", status_code=409)
        return profile

    async def _npc(self, npc_key: str) -> NPC:
        if npc_key != "lumi":
            raise AppError("NOT_FOUND", "Character not found", status_code=404)
        npc = (
            await self.session.execute(select(NPC).where(NPC.key == npc_key))
        ).scalar_one_or_none()
        if npc is None:
            raise AppError("NOT_FOUND", "Character not found", status_code=404)
        return npc

    async def _joy_meadow(self) -> Island:
        island = (
            await self.session.execute(
                select(Island).where(Island.key == "joy_meadow")
            )
        ).scalar_one_or_none()
        if island is None:
            raise AppError("NOT_FOUND", "Joy Meadow is not seeded", status_code=404)
        return island

    async def _quest_status(self, profile_id: UUID) -> str:
        quest = (
            await self.session.execute(
                select(Quest).where(Quest.key == "joy_first_recipe")
            )
        ).scalar_one()
        progress = (
            await self.session.execute(
                select(QuestProgress).where(
                    QuestProgress.player_profile_id == profile_id,
                    QuestProgress.quest_id == quest.id,
                )
            )
        ).scalar_one_or_none()
        return progress.status.value if progress else "not_started"

    async def _is_restored(self, profile_id: UUID, island_id: UUID) -> bool:
        state = (
            await self.session.execute(
                select(WorldState).where(
                    WorldState.player_profile_id == profile_id,
                    WorldState.island_id == island_id,
                )
            )
        ).scalar_one_or_none()
        return bool(state and state.restoration_level >= 100)

    async def _recipe_definition(self, recipe_key: str) -> Recipe:
        if recipe_key != "golden_vanilla_bloom":
            raise AppError("NOT_FOUND", "Recipe not found", status_code=404)
        recipe = (
            await self.session.execute(
                select(Recipe).where(
                    Recipe.key == recipe_key,
                    Recipe.player_profile_id.is_(None),
                )
            )
        ).scalar_one_or_none()
        if recipe is None:
            raise AppError("NOT_FOUND", "Recipe not found", status_code=404)
        return recipe

    def _record_event(
        self,
        event_type: str,
        profile_id: UUID,
        payload: dict,
    ) -> None:
        self.session.add(
            EventLog(
                event_type=event_type,
                aggregate_type="player_profile",
                aggregate_id=profile_id,
                payload=payload,
                published_at=utc_now(),
            )
        )
