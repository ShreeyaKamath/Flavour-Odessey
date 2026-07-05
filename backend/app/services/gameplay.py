from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.core.security import utc_now
from app.models import (
    CompanionState,
    EventLog,
    Ingredient,
    InventoryItem,
    Island,
    JournalEntry,
    NPC,
    PlayerProfile,
    Quest,
    QuestProgress,
    QuestStatus,
    Recipe,
    SaveSlot,
    WorldEvent,
    WorldState,
)
from app.schemas.contracts import (
    DialogueResponse,
    GameIslandState,
    GameStateResponse,
    InventoryItemResponse,
    InventoryResponse,
    JournalEntryResponse,
    JournalResponse,
    QuestStateResponse,
    QuestsResponse,
    RecipeStateResponse,
    RecipesResponse,
    SaveStatusResponse,
)


JOY_MEADOW = "joy_meadow"
FIRST_QUEST = "joy_first_recipe"
FIRST_RECIPE = "golden_vanilla_bloom"
STARTER_INGREDIENTS = ("vanilla_orchid", "honey_bloom")


class GameplayService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_state(self, user_id: UUID) -> GameStateResponse:
        profile = await self._get_profile(user_id)
        island = await self._get_joy_meadow()
        inventory = await self._inventory_items(profile.id)
        recipe = await self._recipe_state(profile.id, inventory)
        quest = await self._quest_state(profile.id, inventory, recipe.crafted)
        journal = await self._journal_entries(profile.id)
        world_state = await self._world_state(profile.id, island.id)
        dialogue = await self._dialogue(world_state)
        save = await self._save_status(profile.id)
        return GameStateResponse(
            started=bool(profile.progress.get("joy_meadow_started")),
            island=GameIslandState(
                island_id=JOY_MEADOW,
                name="Joy Meadow",
                restoration_level=world_state.restoration_level if world_state else 0,
                restored=bool(world_state and world_state.restoration_level >= 100),
            ),
            dialogue=dialogue,
            inventory=inventory,
            quest=quest,
            recipe=recipe,
            journal=journal,
            save=save,
        )

    async def start_game(self, user_id: UUID, island_key: str) -> GameStateResponse:
        self._ensure_joy_meadow(island_key)
        profile = await self._get_profile(user_id)
        island = await self._get_joy_meadow()

        profile.current_island_id = island.id
        profile.progress = {
            **profile.progress,
            "joy_meadow_started": True,
        }
        if await self._world_state(profile.id, island.id) is None:
            self.session.add(
                WorldState(
                    player_profile_id=profile.id,
                    island_id=island.id,
                    restoration_level=0,
                    unlocked=True,
                    state={"phase": "unrestored"},
                )
            )
        if await self._companion_state(profile.id) is None:
            self.session.add(
                CompanionState(
                    player_profile_id=profile.id,
                    companion_key="lumi",
                    name="Lumi",
                    state={"met": True, "form": "small_glow"},
                )
            )

        self._record_event("GameStarted", profile.id, {"island_id": JOY_MEADOW})
        await self._save(profile.id, "GameStarted")
        await self.session.commit()
        return await self.get_state(user_id)

    async def get_inventory(self, user_id: UUID) -> InventoryResponse:
        profile = await self._get_profile(user_id)
        return InventoryResponse(items=await self._inventory_items(profile.id))

    async def collect_ingredient(
        self,
        user_id: UUID,
        ingredient_key: str,
    ) -> GameStateResponse:
        profile = await self._get_started_profile(user_id)
        ingredient = await self._get_ingredient(ingredient_key)
        if ingredient.key not in STARTER_INGREDIENTS:
            raise AppError(
                "INVALID_INPUT",
                "This ingredient is not available in Joy Meadow",
                status_code=422,
            )

        item = await self._inventory_item(profile.id, ingredient.key)
        if item is None:
            item = InventoryItem(
                player_profile_id=profile.id,
                ingredient_id=ingredient.id,
                item_key=ingredient.key,
                quantity=1,
                extra={"collected_once": True},
            )
            self.session.add(item)
        elif not item.extra.get("collected_once"):
            item.quantity += 1
            item.extra = {**item.extra, "collected_once": True}
        else:
            return await self.get_state(user_id)

        self._record_event(
            "IngredientCollected",
            profile.id,
            {"ingredient_id": ingredient.key, "quantity": 1},
        )
        await self._sync_active_quest(profile.id)
        await self._save(profile.id, "IngredientCollected")
        await self.session.commit()
        return await self.get_state(user_id)

    async def get_quests(self, user_id: UUID) -> QuestsResponse:
        profile = await self._get_profile(user_id)
        inventory = await self._inventory_items(profile.id)
        crafted = await self._crafted_recipe(profile.id) is not None
        return QuestsResponse(
            items=[await self._quest_state(profile.id, inventory, crafted)]
        )

    async def start_quest(self, user_id: UUID, quest_key: str) -> GameStateResponse:
        self._ensure_first_quest(quest_key)
        profile = await self._get_started_profile(user_id)
        quest = await self._get_first_quest()
        progress = await self._quest_progress(profile.id, quest.id)
        if progress is None:
            progress = QuestProgress(
                player_profile_id=profile.id,
                quest_id=quest.id,
                status=QuestStatus.ACTIVE,
                progress={},
                evidence={},
            )
            self.session.add(progress)
        elif progress.status == QuestStatus.NOT_STARTED:
            progress.status = QuestStatus.ACTIVE

        await self._sync_progress_record(profile.id, progress)
        self._record_event("QuestStarted", profile.id, {"quest_id": quest.key})
        await self._save(profile.id, "QuestStarted")
        await self.session.commit()
        return await self.get_state(user_id)

    async def update_quest_progress(
        self,
        user_id: UUID,
        quest_key: str,
    ) -> GameStateResponse:
        self._ensure_first_quest(quest_key)
        profile = await self._get_started_profile(user_id)
        progress = await self._require_active_quest(profile.id)
        await self._sync_progress_record(profile.id, progress)
        self._record_event(
            "QuestProgressUpdated",
            profile.id,
            {"quest_id": quest_key, **progress.progress},
        )
        await self._save(profile.id, "QuestProgressUpdated")
        await self.session.commit()
        return await self.get_state(user_id)

    async def complete_quest(
        self,
        user_id: UUID,
        quest_key: str,
    ) -> GameStateResponse:
        self._ensure_first_quest(quest_key)
        profile = await self._get_started_profile(user_id)
        progress = await self._require_active_quest(profile.id, allow_completed=True)
        crafted = await self._crafted_recipe(profile.id)
        if crafted is None:
            raise AppError(
                "CONFLICT",
                "Craft Golden Vanilla Bloom before completing the quest",
                status_code=409,
            )

        progress.status = QuestStatus.COMPLETED
        progress.progress = {
            "collected_ingredients": list(STARTER_INGREDIENTS),
            "recipe_crafted": True,
        }
        progress.evidence = {"recipe_id": str(crafted.id)}
        await self._restore_joy(profile.id, crafted)
        self._record_event(
            "QuestCompleted",
            profile.id,
            {"quest_id": quest_key, "recipe_id": FIRST_RECIPE},
        )
        await self._save(profile.id, "EmotionRestored")
        await self.session.commit()
        return await self.get_state(user_id)

    async def get_recipes(self, user_id: UUID) -> RecipesResponse:
        profile = await self._get_profile(user_id)
        inventory = await self._inventory_items(profile.id)
        return RecipesResponse(items=[await self._recipe_state(profile.id, inventory)])

    async def craft_recipe(
        self,
        user_id: UUID,
        recipe_key: str,
    ) -> GameStateResponse:
        self._ensure_first_recipe(recipe_key)
        profile = await self._get_started_profile(user_id)
        await self._require_active_quest(profile.id)
        existing = await self._crafted_recipe(profile.id)
        if existing is not None:
            return await self.get_state(user_id)

        definition = await self._recipe_definition()
        required = {
            key: int(quantity)
            for key, quantity in definition.ingredients.items()
        }
        items = {
            item.item_key: item
            for item in await self._inventory_records(profile.id)
        }
        missing = [
            key
            for key, quantity in required.items()
            if items.get(key) is None or items[key].quantity < quantity
        ]
        if missing:
            raise AppError(
                "CONFLICT",
                f"Missing required ingredients: {', '.join(missing)}",
                status_code=409,
            )

        for key, quantity in required.items():
            items[key].quantity -= quantity

        crafted = Recipe(
            player_profile_id=profile.id,
            key=definition.key,
            name=definition.name,
            emotion=definition.emotion,
            ingredients=definition.ingredients,
            lore=definition.lore,
            ability=definition.ability,
            extra={"crafted": True, "source_recipe_id": str(definition.id)},
        )
        self.session.add(crafted)
        await self.session.flush()
        await self._sync_active_quest(profile.id)
        self._record_event(
            "RecipeCrafted",
            profile.id,
            {"recipe_id": recipe_key, "name": definition.name},
        )
        await self._save(profile.id, "RecipeCrafted")
        await self.session.commit()
        return await self.get_state(user_id)

    async def get_journal(self, user_id: UUID) -> JournalResponse:
        profile = await self._get_profile(user_id)
        return JournalResponse(items=await self._journal_entries(profile.id))

    async def create_journal_entry(
        self,
        user_id: UUID,
        island_key: str,
    ) -> GameStateResponse:
        self._ensure_joy_meadow(island_key)
        profile = await self._get_started_profile(user_id)
        island = await self._get_joy_meadow()
        world_state = await self._world_state(profile.id, island.id)
        if world_state is None or world_state.restoration_level < 100:
            raise AppError(
                "CONFLICT",
                "Restore Joy Meadow before creating its memory",
                status_code=409,
            )
        crafted = await self._crafted_recipe(profile.id)
        if crafted is None:
            raise AppError("CONFLICT", "The restored recipe is missing", status_code=409)

        await self._ensure_journal_entry(profile.id, island.id, crafted)
        await self._save(profile.id, "JournalUpdated")
        await self.session.commit()
        return await self.get_state(user_id)

    async def restore_island(
        self,
        user_id: UUID,
        island_key: str,
    ) -> GameStateResponse:
        self._ensure_joy_meadow(island_key)
        profile = await self._get_started_profile(user_id)
        progress = await self._require_active_quest(profile.id, allow_completed=True)
        if progress.status != QuestStatus.COMPLETED:
            raise AppError(
                "CONFLICT",
                "Complete Restore the First Scoop before restoring Joy Meadow",
                status_code=409,
            )
        crafted = await self._crafted_recipe(profile.id)
        if crafted is None:
            raise AppError("CONFLICT", "The restoration recipe is missing", status_code=409)

        await self._restore_joy(profile.id, crafted)
        await self._save(profile.id, "EmotionRestored")
        await self.session.commit()
        return await self.get_state(user_id)

    async def _restore_joy(self, profile_id: UUID, crafted: Recipe) -> None:
        island = await self._get_joy_meadow()
        state = await self._world_state(profile_id, island.id)
        newly_restored = state is None or state.restoration_level < 100
        if state is None:
            state = WorldState(
                player_profile_id=profile_id,
                island_id=island.id,
                unlocked=True,
                restoration_level=100,
                state={"phase": "restored"},
            )
            self.session.add(state)
        else:
            state.unlocked = True
            state.restoration_level = 100
            state.state = {**state.state, "phase": "restored"}

        journal_created = await self._ensure_journal_entry(
            profile_id,
            island.id,
            crafted,
        )
        if newly_restored:
            self.session.add(
                WorldEvent(
                    player_profile_id=profile_id,
                    event_type="EmotionRestored",
                    payload={
                        "island_key": JOY_MEADOW,
                        "emotion": "joy",
                        "restoration_level": 100,
                    },
                )
            )
            self._record_event(
                "EmotionRestored",
                profile_id,
                {"island_id": JOY_MEADOW, "restoration_level": 100},
            )
        if journal_created:
            self._record_event(
                "JournalUpdated",
                profile_id,
                {"title": "The Day Joy Returned"},
            )

    async def _ensure_journal_entry(
        self,
        profile_id: UUID,
        island_id: UUID,
        crafted: Recipe,
    ) -> bool:
        statement = select(JournalEntry).where(
            JournalEntry.player_profile_id == profile_id,
            JournalEntry.island_id == island_id,
            JournalEntry.title == "The Day Joy Returned",
        )
        if (await self.session.execute(statement)).scalar_one_or_none():
            return False
        quest = await self._get_first_quest()
        journal_data = quest.reward.get("journal", {})
        self.session.add(
            JournalEntry(
                player_profile_id=profile_id,
                island_id=island_id,
                recipe_id=crafted.id,
                title=journal_data.get("title", "The Day Joy Returned"),
                emotion="joy",
                story=journal_data.get("story", "Joy returned to the meadow."),
                artwork_url=None,
                extra={"source": "joy_meadow_restoration"},
            )
        )
        return True

    async def _inventory_items(self, profile_id: UUID) -> list[InventoryItemResponse]:
        definitions = (
            await self.session.execute(
                select(Ingredient).where(Ingredient.key.in_(STARTER_INGREDIENTS))
            )
        ).scalars().all()
        records = {
            item.item_key: item
            for item in await self._inventory_records(profile_id)
        }
        definitions_by_key = {item.key: item for item in definitions}
        return [
            InventoryItemResponse(
                ingredient_id=key,
                name=definitions_by_key[key].name,
                quantity=records[key].quantity if key in records else 0,
                collected=bool(
                    key in records and records[key].extra.get("collected_once")
                ),
            )
            for key in STARTER_INGREDIENTS
        ]

    async def _inventory_records(self, profile_id: UUID) -> list[InventoryItem]:
        statement = select(InventoryItem).where(
            InventoryItem.player_profile_id == profile_id,
            InventoryItem.item_key.in_(STARTER_INGREDIENTS),
        )
        return list((await self.session.execute(statement)).scalars().all())

    async def _inventory_item(
        self,
        profile_id: UUID,
        ingredient_key: str,
    ) -> InventoryItem | None:
        statement = select(InventoryItem).where(
            InventoryItem.player_profile_id == profile_id,
            InventoryItem.item_key == ingredient_key,
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def _quest_state(
        self,
        profile_id: UUID,
        inventory: list[InventoryItemResponse],
        crafted: bool,
    ) -> QuestStateResponse:
        quest = await self._get_first_quest()
        progress = await self._quest_progress(profile_id, quest.id)
        status = progress.status.value if progress else QuestStatus.NOT_STARTED.value
        collected = [
            item.ingredient_id
            for item in inventory
            if item.collected
        ]
        return QuestStateResponse(
            quest_id=quest.key,
            title=quest.title,
            description=quest.description or "",
            status=status,
            required_ingredients=list(STARTER_INGREDIENTS),
            collected_ingredients=collected,
            recipe_id=FIRST_RECIPE,
            crafted=crafted,
            can_complete=status == QuestStatus.ACTIVE.value and crafted,
        )

    async def _recipe_state(
        self,
        profile_id: UUID,
        inventory: list[InventoryItemResponse],
    ) -> RecipeStateResponse:
        definition = await self._recipe_definition()
        crafted = await self._crafted_recipe(profile_id) is not None
        quantities = {item.ingredient_id: item.quantity for item in inventory}
        can_craft = not crafted and all(
            quantities.get(key, 0) >= int(quantity)
            for key, quantity in definition.ingredients.items()
        )
        return RecipeStateResponse(
            recipe_id=definition.key or FIRST_RECIPE,
            name=definition.name,
            emotion=definition.emotion,
            lore=definition.lore or "",
            ability=definition.ability or "",
            required_ingredients=list(definition.ingredients),
            crafted=crafted,
            can_craft=can_craft,
        )

    async def _journal_entries(self, profile_id: UUID) -> list[JournalEntryResponse]:
        entries = (
            await self.session.execute(
                select(JournalEntry)
                .where(JournalEntry.player_profile_id == profile_id)
                .order_by(JournalEntry.created_at.desc())
            )
        ).scalars().all()
        recipe_ids = {entry.recipe_id for entry in entries if entry.recipe_id}
        recipes: dict[UUID, Recipe] = {}
        if recipe_ids:
            recipe_records = (
                await self.session.execute(
                    select(Recipe).where(Recipe.id.in_(recipe_ids))
                )
            ).scalars().all()
            recipes = {recipe.id: recipe for recipe in recipe_records}
        return [
            JournalEntryResponse(
                id=entry.id,
                title=entry.title,
                content=entry.story,
                emotion=entry.emotion or "",
                recipe_name=(
                    recipes[entry.recipe_id].name
                    if entry.recipe_id in recipes
                    else None
                ),
                created_at=entry.created_at,
            )
            for entry in entries
        ]

    async def _dialogue(
        self,
        world_state: WorldState | None,
    ) -> list[DialogueResponse]:
        records = (
            await self.session.execute(
                select(NPC).where(NPC.key.in_(("lumi", "joy_meadow_keeper")))
            )
        ).scalars().all()
        by_key = {record.key: record for record in records}
        restored = bool(world_state and world_state.restoration_level >= 100)
        dialogue_key = "after_restoration" if restored else "before_restoration"
        response = []
        for key in ("lumi", "joy_meadow_keeper"):
            character = by_key.get(key)
            if character is None:
                continue
            text = character.profile.get("dialogue", {}).get(dialogue_key, "")
            response.append(
                DialogueResponse(
                    character_id=character.key,
                    character_name=character.name,
                    role="companion" if character.role == "companion" else "npc",
                    text=text,
                )
            )
        return response

    async def _save_status(self, profile_id: UUID) -> SaveStatusResponse:
        slot = await self._save_slot(profile_id)
        saved_at = slot.state.get("last_saved_at") if slot else None
        return SaveStatusResponse(
            status="saved" if saved_at else "not_saved",
            last_saved_at=datetime.fromisoformat(saved_at) if saved_at else None,
            last_event=slot.state.get("last_event") if slot else None,
        )

    async def _save(self, profile_id: UUID, event_type: str) -> None:
        slot = await self._save_slot(profile_id)
        if slot is None:
            slot = SaveSlot(
                player_profile_id=profile_id,
                slot_number=1,
                name="Autosave",
                state={},
            )
            self.session.add(slot)
        saved_at = utc_now()
        slot.state = {
            **slot.state,
            "current_island": JOY_MEADOW,
            "last_event": event_type,
            "last_saved_at": saved_at.isoformat(),
        }
        self._record_event(
            "SaveCompleted",
            profile_id,
            {"slot_number": 1, "trigger": event_type},
        )

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

    async def _sync_active_quest(self, profile_id: UUID) -> None:
        quest = await self._get_first_quest()
        progress = await self._quest_progress(profile_id, quest.id)
        if progress and progress.status == QuestStatus.ACTIVE:
            await self._sync_progress_record(profile_id, progress)

    async def _sync_progress_record(
        self,
        profile_id: UUID,
        progress: QuestProgress,
    ) -> None:
        inventory = await self._inventory_items(profile_id)
        progress.progress = {
            "collected_ingredients": [
                item.ingredient_id for item in inventory if item.collected
            ],
            "recipe_crafted": await self._crafted_recipe(profile_id) is not None,
        }

    async def _get_profile(self, user_id: UUID) -> PlayerProfile:
        statement = (
            select(PlayerProfile)
            .where(PlayerProfile.user_id == user_id)
            .order_by(PlayerProfile.created_at)
            .limit(1)
        )
        profile = (await self.session.execute(statement)).scalar_one_or_none()
        if profile is None:
            raise AppError("NOT_FOUND", "Player profile not found", status_code=404)
        return profile

    async def _get_started_profile(self, user_id: UUID) -> PlayerProfile:
        profile = await self._get_profile(user_id)
        if not profile.progress.get("joy_meadow_started"):
            raise AppError("CONFLICT", "Start Joy Meadow first", status_code=409)
        return profile

    async def _get_joy_meadow(self) -> Island:
        statement = select(Island).where(Island.key == JOY_MEADOW)
        island = (await self.session.execute(statement)).scalar_one_or_none()
        if island is None:
            raise AppError("NOT_FOUND", "Joy Meadow is not seeded", status_code=404)
        return island

    async def _get_first_quest(self) -> Quest:
        statement = select(Quest).where(Quest.key == FIRST_QUEST)
        quest = (await self.session.execute(statement)).scalar_one_or_none()
        if quest is None:
            raise AppError("NOT_FOUND", "The first quest is not seeded", status_code=404)
        return quest

    async def _recipe_definition(self) -> Recipe:
        statement = select(Recipe).where(
            Recipe.key == FIRST_RECIPE,
            Recipe.player_profile_id.is_(None),
        )
        recipe = (await self.session.execute(statement)).scalar_one_or_none()
        if recipe is None:
            raise AppError("NOT_FOUND", "The first recipe is not seeded", status_code=404)
        return recipe

    async def _crafted_recipe(self, profile_id: UUID) -> Recipe | None:
        statement = select(Recipe).where(
            Recipe.key == FIRST_RECIPE,
            Recipe.player_profile_id == profile_id,
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def _get_ingredient(self, ingredient_key: str) -> Ingredient:
        statement = select(Ingredient).where(Ingredient.key == ingredient_key)
        ingredient = (await self.session.execute(statement)).scalar_one_or_none()
        if ingredient is None:
            raise AppError("NOT_FOUND", "Ingredient not found", status_code=404)
        return ingredient

    async def _quest_progress(
        self,
        profile_id: UUID,
        quest_id: UUID,
    ) -> QuestProgress | None:
        statement = select(QuestProgress).where(
            QuestProgress.player_profile_id == profile_id,
            QuestProgress.quest_id == quest_id,
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def _require_active_quest(
        self,
        profile_id: UUID,
        allow_completed: bool = False,
    ) -> QuestProgress:
        quest = await self._get_first_quest()
        progress = await self._quest_progress(profile_id, quest.id)
        valid_statuses = {QuestStatus.ACTIVE}
        if allow_completed:
            valid_statuses.add(QuestStatus.COMPLETED)
        if progress is None or progress.status not in valid_statuses:
            raise AppError(
                "CONFLICT",
                "Start Restore the First Scoop first",
                status_code=409,
            )
        return progress

    async def _world_state(
        self,
        profile_id: UUID,
        island_id: UUID,
    ) -> WorldState | None:
        statement = select(WorldState).where(
            WorldState.player_profile_id == profile_id,
            WorldState.island_id == island_id,
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def _companion_state(self, profile_id: UUID) -> CompanionState | None:
        statement = select(CompanionState).where(
            CompanionState.player_profile_id == profile_id
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    async def _save_slot(self, profile_id: UUID) -> SaveSlot | None:
        statement = select(SaveSlot).where(
            SaveSlot.player_profile_id == profile_id,
            SaveSlot.slot_number == 1,
        )
        return (await self.session.execute(statement)).scalar_one_or_none()

    @staticmethod
    def _ensure_joy_meadow(island_key: str) -> None:
        if island_key != JOY_MEADOW:
            raise AppError(
                "FORBIDDEN",
                "Only Joy Meadow is playable in the MVP",
                status_code=403,
            )

    @staticmethod
    def _ensure_first_quest(quest_key: str) -> None:
        if quest_key != FIRST_QUEST:
            raise AppError("NOT_FOUND", "Quest not found", status_code=404)

    @staticmethod
    def _ensure_first_recipe(recipe_key: str) -> None:
        if recipe_key != FIRST_RECIPE:
            raise AppError("NOT_FOUND", "Recipe not found", status_code=404)
