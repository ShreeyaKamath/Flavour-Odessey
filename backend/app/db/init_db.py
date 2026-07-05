import json
from pathlib import Path
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    AssetManifest,
    AssetManifestType,
    Ingredient,
    IngredientRarity,
    Island,
    NPC,
    Quest,
    Recipe,
    WeatherState,
    WeatherType,
    WorldEvent,
)
from app.db.session import AsyncSessionLocal


DEFAULT_SEED_PATH = Path(__file__).resolve().parents[3] / "database" / "seeds" / "mvp_seed.json"


async def seed_mvp_data(session: AsyncSession, seed_path: Path = DEFAULT_SEED_PATH) -> None:
    payload = json.loads(seed_path.read_text(encoding="utf-8"))

    islands_by_key = await _seed_islands(session, payload.get("islands", []))
    await _seed_npcs(session, payload.get("npcs", []), islands_by_key)
    await _seed_ingredients(session, payload.get("ingredients", []))
    await _seed_quests(session, payload.get("quests", []), islands_by_key)
    await _seed_recipes(session, payload.get("recipes", []))
    await _seed_asset_manifests(session, payload.get("asset_manifests", []))
    await _seed_weather_states(session, payload.get("weather_states", []), islands_by_key)
    await _seed_world_events(session, payload.get("world_events", []))
    await session.flush()


async def seed_database() -> None:
    async with AsyncSessionLocal() as session:
        await seed_mvp_data(session)
        await session.commit()


async def _seed_islands(session: AsyncSession, islands: list[dict[str, Any]]) -> dict[str, Island]:
    records: dict[str, Island] = {}
    for item in islands:
        island = await _get_by_key(session, Island, item["key"])
        if island is None:
            island = Island(
                key=item["key"],
                name=item["name"],
                emotion=item["emotion"],
                description=item.get("description"),
                is_unlocked_by_default=item.get("is_unlocked_by_default", False),
                extra=item.get("extra", {}),
            )
            session.add(island)
            await session.flush()
        else:
            island.name = item["name"]
            island.emotion = item["emotion"]
            island.description = item.get("description")
            island.is_unlocked_by_default = item.get("is_unlocked_by_default", False)
            island.extra = item.get("extra", {})
        records[island.key] = island
    return records


async def _seed_npcs(
    session: AsyncSession, npcs: list[dict[str, Any]], islands_by_key: dict[str, Island]
) -> None:
    for item in npcs:
        npc = await _get_by_key(session, NPC, item["key"])
        if npc is None:
            island = islands_by_key.get(item.get("island_key", ""))
            npc = NPC(
                key=item["key"],
                island_id=island.id if island else None,
                name=item["name"],
                role=item["role"],
                profile=item.get("profile", {}),
            )
            session.add(npc)
        else:
            island = islands_by_key.get(item.get("island_key", ""))
            npc.island_id = island.id if island else None
            npc.name = item["name"]
            npc.role = item["role"]
            npc.profile = item.get("profile", {})


async def _seed_ingredients(session: AsyncSession, ingredients: list[dict[str, Any]]) -> None:
    for item in ingredients:
        ingredient = await _get_by_key(session, Ingredient, item["key"])
        if ingredient is None:
            ingredient = Ingredient(
                key=item["key"],
                name=item["name"],
                rarity=IngredientRarity(item.get("rarity", IngredientRarity.COMMON)),
                extra=item.get("extra", {}),
            )
            session.add(ingredient)
        else:
            ingredient.name = item["name"]
            ingredient.rarity = IngredientRarity(
                item.get("rarity", IngredientRarity.COMMON)
            )
            ingredient.extra = item.get("extra", {})


async def _seed_quests(
    session: AsyncSession, quests: list[dict[str, Any]], islands_by_key: dict[str, Island]
) -> None:
    for item in quests:
        quest = await _get_by_key(session, Quest, item["key"])
        if quest is None:
            island = islands_by_key.get(item.get("island_key", ""))
            quest = Quest(
                key=item["key"],
                title=item["title"],
                description=item.get("description"),
                island_id=island.id if island else None,
                reward=item.get("reward", {}),
                requirements=item.get("requirements", {}),
            )
            session.add(quest)
        else:
            island = islands_by_key.get(item.get("island_key", ""))
            quest.title = item["title"]
            quest.description = item.get("description")
            quest.island_id = island.id if island else None
            quest.reward = item.get("reward", {})
            quest.requirements = item.get("requirements", {})


async def _seed_recipes(
    session: AsyncSession,
    recipes: list[dict[str, Any]],
) -> None:
    for item in recipes:
        statement = select(Recipe).where(
            Recipe.key == item["key"],
            Recipe.player_profile_id.is_(None),
        )
        recipe = (await session.execute(statement)).scalar_one_or_none()
        if recipe is None:
            recipe = Recipe(
                key=item["key"],
                name=item["name"],
                emotion=item["emotion"],
            )
            session.add(recipe)
        recipe.ingredients = item.get("ingredients", {})
        recipe.lore = item.get("lore")
        recipe.ability = item.get("ability")
        recipe.extra = item.get("extra", {})


async def _seed_asset_manifests(session: AsyncSession, manifests: list[dict[str, Any]]) -> None:
    for item in manifests:
        statement = select(AssetManifest).where(AssetManifest.asset_key == item["asset_key"])
        manifest = (await session.execute(statement)).scalar_one_or_none()
        if manifest is None:
            session.add(
                AssetManifest(
                    manifest_type=AssetManifestType(item["manifest_type"]),
                    asset_key=item["asset_key"],
                    path=item["path"],
                    extra=item.get("extra", {}),
                )
            )
        else:
            manifest.manifest_type = AssetManifestType(item["manifest_type"])
            manifest.path = item["path"]
            manifest.extra = item.get("extra", {})


async def _seed_weather_states(
    session: AsyncSession,
    weather_states: list[dict[str, Any]],
    islands_by_key: dict[str, Island],
) -> None:
    for item in weather_states:
        island = islands_by_key[item["island_key"]]
        statement = select(WeatherState).where(
            WeatherState.island_id == island.id,
            WeatherState.player_profile_id.is_(None),
        )
        weather = (await session.execute(statement)).scalar_one_or_none()
        if weather is None:
            weather = WeatherState(island_id=island.id)
            session.add(weather)
        weather.weather_type = WeatherType(item["weather_type"])
        weather.intensity = item.get("intensity", 0)
        weather.state = item.get("state", {})


async def _seed_world_events(
    session: AsyncSession,
    world_events: list[dict[str, Any]],
) -> None:
    for item in world_events:
        statement = select(WorldEvent).where(
            WorldEvent.event_type == item["event_type"],
            WorldEvent.player_profile_id.is_(None),
        )
        existing = (await session.execute(statement)).scalars().all()
        event_key = item.get("payload", {}).get("event_key")
        event = next(
            (
                record
                for record in existing
                if record.payload.get("event_key") == event_key
            ),
            None,
        )
        if event is None:
            event = WorldEvent(event_type=item["event_type"])
            session.add(event)
        event.payload = item.get("payload", {})


async def _get_by_key(session: AsyncSession, model: type, key: str):
    statement = select(model).where(model.key == key)
    return (await session.execute(statement)).scalar_one_or_none()


if __name__ == "__main__":
    import asyncio

    asyncio.run(seed_database())
