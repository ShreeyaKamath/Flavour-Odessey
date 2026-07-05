from __future__ import annotations

from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.models import (
    AssetManifest,
    Island,
    PlayerProfile,
    WeatherState,
    WorldEvent,
    WorldState,
)
from app.schemas.contracts import (
    AmbientMetadata,
    IslandSummary,
    IslandsResponse,
    LandmarkResponse,
    ManifestReference,
    WeatherResponse,
    WeatherStateResponse,
    WorldEventResponse,
    WorldEventsResponse,
    WorldMapPosition,
    WorldResponse,
)


class WorldService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_world(self, user_id: UUID) -> WorldResponse:
        profile_id = await self._get_profile_id(user_id)
        islands = await self._load_islands(profile_id)
        weather = await self._load_weather(profile_id)
        events = await self._load_events(profile_id)
        return WorldResponse(islands=islands, weather=weather, events=events)

    async def get_islands(self, user_id: UUID) -> IslandsResponse:
        profile_id = await self._get_profile_id(user_id)
        return IslandsResponse(items=await self._load_islands(profile_id))

    async def get_island(self, user_id: UUID, island_key: str) -> IslandSummary:
        profile_id = await self._get_profile_id(user_id)
        islands = await self._load_islands(profile_id)
        island = next((item for item in islands if item.key == island_key), None)
        if island is None:
            raise AppError("NOT_FOUND", "Island not found", status_code=404)
        return island

    async def get_weather(self, user_id: UUID) -> WeatherResponse:
        profile_id = await self._get_profile_id(user_id)
        return WeatherResponse(items=await self._load_weather(profile_id))

    async def get_events(self, user_id: UUID) -> WorldEventsResponse:
        profile_id = await self._get_profile_id(user_id)
        return WorldEventsResponse(items=await self._load_events(profile_id))

    async def _get_profile_id(self, user_id: UUID) -> UUID:
        statement = (
            select(PlayerProfile.id)
            .where(PlayerProfile.user_id == user_id)
            .order_by(PlayerProfile.created_at)
            .limit(1)
        )
        profile_id = (await self.session.execute(statement)).scalar_one_or_none()
        if profile_id is None:
            raise AppError("NOT_FOUND", "Player profile not found", status_code=404)
        return profile_id

    async def _load_islands(self, profile_id: UUID) -> list[IslandSummary]:
        islands = (await self.session.execute(select(Island))).scalars().all()
        states = (
            await self.session.execute(
                select(WorldState).where(WorldState.player_profile_id == profile_id)
            )
        ).scalars().all()
        states_by_island = {state.island_id: state for state in states}

        manifest_keys = {
            key
            for island in islands
            for key in island.extra.get("manifest_keys", [])
            if isinstance(key, str)
        }
        manifests_by_key: dict[str, AssetManifest] = {}
        if manifest_keys:
            manifests = (
                await self.session.execute(
                    select(AssetManifest).where(
                        AssetManifest.asset_key.in_(manifest_keys)
                    )
                )
            ).scalars().all()
            manifests_by_key = {item.asset_key: item for item in manifests}

        response = [
            self._to_island(
                island,
                states_by_island.get(island.id),
                manifests_by_key,
            )
            for island in islands
        ]
        return sorted(response, key=lambda item: item.map_order)

    async def _load_weather(self, profile_id: UUID) -> list[WeatherStateResponse]:
        islands = (await self.session.execute(select(Island))).scalars().all()
        islands_by_id = {island.id: island for island in islands}
        records = (
            await self.session.execute(
                select(WeatherState).where(
                    or_(
                        WeatherState.player_profile_id.is_(None),
                        WeatherState.player_profile_id == profile_id,
                    )
                )
            )
        ).scalars().all()

        selected: dict[UUID, WeatherState] = {}
        for record in records:
            if record.island_id is None:
                continue
            current = selected.get(record.island_id)
            if current is None or record.player_profile_id == profile_id:
                selected[record.island_id] = record

        response = []
        for island_id, record in selected.items():
            island = islands_by_id.get(island_id)
            if island is None:
                continue
            response.append(
                WeatherStateResponse(
                    id=record.id,
                    island_id=island.id,
                    island_key=island.key,
                    condition=record.weather_type.value,
                    intensity=record.intensity,
                    details=record.state,
                )
            )
        return sorted(
            response,
            key=lambda item: islands_by_id[item.island_id].extra.get("map_order", 0),
        )

    async def _load_events(self, profile_id: UUID) -> list[WorldEventResponse]:
        statement = (
            select(WorldEvent)
            .where(
                or_(
                    WorldEvent.player_profile_id.is_(None),
                    WorldEvent.player_profile_id == profile_id,
                )
            )
            .order_by(WorldEvent.created_at.desc())
            .limit(20)
        )
        records = (await self.session.execute(statement)).scalars().all()
        return [
            WorldEventResponse(
                id=record.id,
                event_type=record.event_type,
                island_key=record.payload.get("island_key"),
                payload=record.payload,
                occurred_at=record.created_at,
            )
            for record in records
        ]

    @staticmethod
    def _to_island(
        island: Island,
        state: WorldState | None,
        manifests_by_key: dict[str, AssetManifest],
    ) -> IslandSummary:
        extra = island.extra
        unlocked = state.unlocked if state else island.is_unlocked_by_default
        restoration_level = state.restoration_level if state else 0
        if restoration_level >= 100:
            restoration_state = "restored"
        elif restoration_level > 0:
            restoration_state = "restoring"
        else:
            restoration_state = "unrestored"

        manifests = []
        for key in extra.get("manifest_keys", []):
            manifest = manifests_by_key.get(key)
            if manifest:
                manifests.append(
                    ManifestReference(
                        key=manifest.asset_key,
                        manifest_type=manifest.manifest_type.value,
                        path=manifest.path,
                    )
                )

        return IslandSummary(
            id=island.id,
            key=island.key,
            name=island.name,
            emotion=island.emotion,
            description=island.description or "",
            unlocked=unlocked,
            availability="playable" if unlocked else "coming_in_version_1",
            restoration_level=restoration_level,
            restoration_state=restoration_state,
            map_order=extra.get("map_order", 0),
            map_position=WorldMapPosition(**extra.get("map_position", {"x": 0, "y": 0})),
            landmarks=[
                LandmarkResponse(**landmark)
                for landmark in extra.get("landmarks", [])
            ],
            ambient=AmbientMetadata(
                **extra.get(
                    "ambient",
                    {"description": "", "palette": [], "sounds": []},
                )
            ),
            manifests=manifests,
        )
