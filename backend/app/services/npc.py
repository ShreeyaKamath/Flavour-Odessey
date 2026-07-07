from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.core.security import utc_now
from app.models import EventLog, Island, NPC, NPCMemory, NPCRelationship, PlayerProfile
from app.schemas.contracts import (
    NpcConversationTurn,
    NpcGiftPreferences,
    NpcGiftResponse,
    NpcMovementState,
    NpcRelationshipState,
    NpcScheduleStep,
    NpcStateResponse,
    NpcsResponse,
)

JOY_MEADOW_NPC_KEYS = (
    "joy_meadow_keeper",
    "joy_meadow_baker",
    "joy_meadow_gardener",
    "joy_meadow_child_explorer",
    "joy_meadow_traveling_merchant",
)

SUPPORTED_EMOTIONS = {
    "happy",
    "excited",
    "curious",
    "thinking",
    "confused",
    "sleepy",
    "sad",
    "celebrating",
    "proud",
    "relaxed",
    "embarrassed",
    "surprised",
}

DEFAULT_SCHEDULE = [
    {
        "label": "Morning",
        "activity": "Water Flowers",
        "location": "Flower Beds",
        "starts_at": "06:00",
    },
    {
        "label": "Late Morning",
        "activity": "Visit Bakery",
        "location": "Bakery Porch",
        "starts_at": "09:00",
    },
    {
        "label": "Noon",
        "activity": "Walk Bridge",
        "location": "Small Bridge",
        "starts_at": "12:00",
    },
    {
        "label": "Afternoon",
        "activity": "Talk to Lumi",
        "location": "Recipe Shrine",
        "starts_at": "15:00",
    },
    {
        "label": "Evening",
        "activity": "Rest",
        "location": "Journal Tree",
        "starts_at": "18:00",
    },
    {
        "label": "Dusk",
        "activity": "Go Home",
        "location": "Meadow Path",
        "starts_at": "21:00",
    },
    {
        "label": "Night",
        "activity": "Sleep",
        "location": "Meadow Cottage",
        "starts_at": "23:00",
    },
]

MOOD_BY_ACTIVITY = {
    "Go Home": "sleepy",
    "Rest": "relaxed",
    "Sleep": "sleepy",
    "Talk to Lumi": "happy",
    "Visit Bakery": "excited",
    "Walk Bridge": "curious",
    "Water Flowers": "thinking",
}

SPEECH_SPEED_BY_MOOD = {
    "curious": "bright",
    "excited": "bright",
    "happy": "normal",
    "relaxed": "dreamy",
    "sleepy": "slow",
    "thinking": "normal",
}


class NPCService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_npcs(self, user_id: UUID) -> NpcsResponse:
        profile = await self._started_profile(user_id)
        npcs = await self._joy_meadow_npcs()
        return NpcsResponse(
            items=[
                await self._build_state(profile, npc)
                for npc in sorted(npcs, key=lambda item: JOY_MEADOW_NPC_KEYS.index(item.key))
            ]
        )

    async def get_npc(self, user_id: UUID, npc_key: str) -> NpcStateResponse:
        profile = await self._started_profile(user_id)
        npc = await self.get_joy_meadow_npc(npc_key)
        return await self._build_state(profile, npc)

    async def apply_conversation(
        self,
        profile: PlayerProfile,
        npc: NPC,
        player_message: str,
        reply: str,
        mood: str,
        importance: int,
    ) -> NpcRelationshipState:
        relationship = await self._relationship(profile.id, npc.id)
        state = dict(relationship.state or {})
        history = list(state.get("conversation_history", []))
        now = utc_now().isoformat()
        history.extend(
            [
                {
                    "speaker": "player",
                    "text": player_message,
                    "mood": "curious",
                    "occurred_at": now,
                },
                {"speaker": "npc", "text": reply, "mood": mood, "occurred_at": now},
            ]
        )
        relationship.friendship = min(500, relationship.friendship + 3)
        relationship.trust = min(500, relationship.trust + (2 if importance >= 4 else 1))
        state.update(
            {
                "conversation_history": history[-12:],
                "current_mood": mood,
                "last_conversation": player_message,
                "last_visit": now,
                "memory_summary": self._memory_summary(player_message),
            }
        )
        relationship.state = state
        self._record_event(
            "NPCFriendshipChanged",
            profile.id,
            {"npc_id": npc.key, "friendship": relationship.friendship, "trust": relationship.trust},
        )
        await self.session.flush()
        memories = await self._memory_highlights(profile.id, npc.id)
        return self._relationship_state(relationship, memories)

    async def give_placeholder_gift(
        self,
        user_id: UUID,
        npc_key: str,
        gift_id: str,
    ) -> NpcGiftResponse:
        profile = await self._started_profile(user_id)
        npc = await self.get_joy_meadow_npc(npc_key)
        relationship = await self._relationship(profile.id, npc.id)
        preferences = self._gift_preferences(npc)
        normalized = gift_id.lower().replace(" ", "_")
        if normalized in preferences.loves:
            friendship_delta = 8
            trust_delta = 3
            reaction = f"{npc.name} treasures the {gift_id} and promises to remember it."
            mood = "celebrating"
        elif normalized in preferences.likes:
            friendship_delta = 5
            trust_delta = 2
            reaction = f"{npc.name} smiles warmly at the {gift_id}."
            mood = "happy"
        else:
            friendship_delta = 2
            trust_delta = 0
            reaction = f"{npc.name} accepts the {gift_id} politely."
            mood = "embarrassed"
        relationship.friendship = min(500, relationship.friendship + friendship_delta)
        relationship.trust = min(500, relationship.trust + trust_delta)
        state = dict(relationship.state or {})
        state.update({"current_mood": mood, "last_gift": gift_id})
        relationship.state = state
        self.session.add(
            NPCMemory(
                player_profile_id=profile.id,
                npc_id=npc.id,
                memory_type="gift",
                content=f"Received {gift_id}",
                importance=4 if trust_delta else 2,
                extra={"gift_id": gift_id},
            )
        )
        self._record_event(
            "NPCFriendshipChanged",
            profile.id,
            {"npc_id": npc.key, "gift_id": gift_id, "friendship": relationship.friendship},
        )
        await self.session.commit()
        memories = await self._memory_highlights(profile.id, npc.id)
        return NpcGiftResponse(
            npc_id=npc.key,
            reaction=reaction,
            friendship_delta=friendship_delta,
            trust_delta=trust_delta,
            relationship=self._relationship_state(relationship, memories),
        )

    async def get_joy_meadow_npc(self, npc_key: str) -> NPC:
        if npc_key not in JOY_MEADOW_NPC_KEYS:
            raise AppError("NOT_FOUND", "Joy Meadow villager not found", status_code=404)
        npc = (
            await self.session.execute(select(NPC).where(NPC.key == npc_key))
        ).scalar_one_or_none()
        if npc is None:
            raise AppError("NOT_FOUND", "Joy Meadow villager not found", status_code=404)
        return npc

    async def _build_state(self, profile: PlayerProfile, npc: NPC) -> NpcStateResponse:
        relationship = await self._relationship(profile.id, npc.id)
        memories = await self._memory_highlights(profile.id, npc.id)
        schedule = self._schedule(npc)
        active_index, movement = self._movement(schedule)
        active = schedule[active_index]
        state = dict(relationship.state or {})
        profile_data = dict(npc.profile or {})
        mood = state.get("current_mood") or MOOD_BY_ACTIVITY.get(active.activity, "happy")
        if mood not in SUPPORTED_EMOTIONS:
            mood = "happy"
        energy = 32 if active.activity == "Sleep" else int(profile_data.get("energy_level", 72))
        return NpcStateResponse(
            id=npc.id,
            npc_id=npc.key,
            name=npc.name,
            portrait=str(profile_data.get("portrait", f"npc.{npc.key}.portrait")),
            occupation=str(profile_data.get("occupation", npc.role)),
            age_group=str(profile_data.get("age_group", "adult")),
            voice_style=str(profile_data.get("voice_style", "warm and concise")),
            favorite_flavor=str(profile_data.get("favorite_flavor", "Golden Vanilla Bloom")),
            favorite_weather=str(profile_data.get("favorite_weather", "Warm breeze")),
            favorite_flower=str(profile_data.get("favorite_flower", "Vanilla Orchid")),
            personality=list(profile_data.get("personality", ["warm", "hopeful"])),
            current_mood=mood,
            energy_level=energy,
            current_goal=str(profile_data.get("current_goal", "Help Joy Meadow remember laughter")),
            current_activity=active.activity,
            current_location=active.location,
            memory_summary=str(
                state.get("memory_summary")
                or profile_data.get("memory_summary")
                or "No shared memories yet."
            ),
            relationship=self._relationship_state(relationship, memories),
            gift_preferences=self._gift_preferences(npc),
            daily_schedule=schedule,
            animation_state=self._animation_state(active.activity, mood),
            emotion_icon=self._emotion_icon(mood),
            speech_speed=SPEECH_SPEED_BY_MOOD.get(mood, "normal"),
            thought_bubble=self._thought_bubble(npc, mood),
            speech_bubble=str(
                profile_data.get("dialogue", {}).get(
                    "after_restoration"
                    if profile.progress.get("joy_meadow_restored")
                    else "before_restoration",
                    "The meadow is listening.",
                )
            ),
            lumi_reaction=str(profile_data.get("lumi_reaction", "smiles and waves to Lumi")),
            movement=movement,
        )

    async def _started_profile(self, user_id: UUID) -> PlayerProfile:
        profile = (
            await self.session.execute(
                select(PlayerProfile)
                .where(PlayerProfile.user_id == user_id)
                .order_by(PlayerProfile.created_at)
                .limit(1)
            )
        ).scalar_one_or_none()
        if profile is None or not profile.progress.get("joy_meadow_started"):
            raise AppError("CONFLICT", "Start Joy Meadow first", status_code=409)
        return profile

    async def _joy_meadow_npcs(self) -> list[NPC]:
        island = (
            await self.session.execute(select(Island).where(Island.key == "joy_meadow"))
        ).scalar_one_or_none()
        if island is None:
            raise AppError("NOT_FOUND", "Joy Meadow is not seeded", status_code=404)
        records = (
            await self.session.execute(
                select(NPC).where(NPC.island_id == island.id, NPC.key.in_(JOY_MEADOW_NPC_KEYS))
            )
        ).scalars().all()
        if len(records) < len(JOY_MEADOW_NPC_KEYS):
            raise AppError("NOT_FOUND", "Joy Meadow villagers are not seeded", status_code=404)
        return list(records)

    async def _relationship(self, profile_id: UUID, npc_id: UUID) -> NPCRelationship:
        relationship = (
            await self.session.execute(
                select(NPCRelationship).where(
                    NPCRelationship.player_profile_id == profile_id,
                    NPCRelationship.npc_id == npc_id,
                )
            )
        ).scalar_one_or_none()
        if relationship is None:
            relationship = NPCRelationship(
                player_profile_id=profile_id,
                npc_id=npc_id,
                friendship=0,
                trust=0,
                state={},
            )
            self.session.add(relationship)
            await self.session.flush()
        return relationship

    async def _memory_highlights(self, profile_id: UUID, npc_id: UUID) -> list[str]:
        memories = (
            await self.session.execute(
                select(NPCMemory)
                .where(NPCMemory.player_profile_id == profile_id, NPCMemory.npc_id == npc_id)
                .order_by(NPCMemory.importance.desc(), NPCMemory.created_at.desc())
                .limit(3)
            )
        ).scalars().all()
        return [memory.content for memory in memories]

    def _relationship_state(
        self,
        relationship: NPCRelationship,
        memories: list[str],
    ) -> NpcRelationshipState:
        state = dict(relationship.state or {})
        history = [
            NpcConversationTurn(
                speaker=turn["speaker"],
                text=turn["text"],
                mood=turn.get("mood", "happy"),
                occurred_at=datetime.fromisoformat(turn["occurred_at"]),
            )
            for turn in state.get("conversation_history", [])
        ]
        friendship_level = relationship.friendship // 25
        trust_level = relationship.trust // 25
        milestones = []
        if relationship.friendship >= 25:
            milestones.append("Friendly Neighbor")
        if relationship.trust >= 25:
            milestones.append("Trusted Flavor Keeper")
        return NpcRelationshipState(
            friendship_xp=relationship.friendship,
            trust_xp=relationship.trust,
            friendship_level=friendship_level,
            trust_level=trust_level,
            relationship_status=self._relationship_status(friendship_level, trust_level),
            milestones=milestones,
            memory_highlights=memories,
            conversation_history=history,
        )

    def _schedule(self, npc: NPC) -> list[NpcScheduleStep]:
        schedule = npc.profile.get("daily_schedule") or DEFAULT_SCHEDULE
        return [NpcScheduleStep(**step) for step in schedule]

    def _movement(self, schedule: list[NpcScheduleStep]) -> tuple[int, NpcMovementState]:
        now = utc_now()
        hour = now.hour + now.minute / 60
        start_hours = [self._schedule_hour(step.starts_at) for step in schedule]
        active_index = 0
        for index, start_hour in enumerate(start_hours):
            if hour >= start_hour:
                active_index = index
        next_index = (active_index + 1) % len(schedule)
        active_start = start_hours[active_index]
        next_start = start_hours[next_index] + (24 if next_index <= active_index else 0)
        current_hour = hour + (24 if hour < active_start else 0)
        span = max(next_start - active_start, 1)
        progress = min(1.0, max(0.0, (current_hour - active_start) / span))
        return active_index, NpcMovementState(
            from_location=schedule[active_index].location,
            to_location=schedule[next_index].location,
            progress=round(progress, 2),
        )

    def _gift_preferences(self, npc: NPC) -> NpcGiftPreferences:
        raw = npc.profile.get("gift_preferences", {})
        return NpcGiftPreferences(
            loves=list(raw.get("loves", ["golden_vanilla_bloom"])),
            likes=list(raw.get("likes", ["vanilla_orchid", "honey_bloom"])),
            avoids=list(raw.get("avoids", ["wilted_petal"])),
        )

    def _animation_state(self, activity: str, mood: str) -> str:
        if activity == "Sleep":
            return "sleeping"
        if "Water" in activity:
            return "garden"
        if "Bakery" in activity:
            return "eat_ice_cream"
        if "Bridge" in activity:
            return "walk"
        if mood == "celebrating":
            return "celebrate"
        if mood == "thinking":
            return "read"
        return "idle_breathing"

    def _thought_bubble(self, npc: NPC, mood: str) -> str:
        if mood == "sleepy":
            return "Dreaming of soft meadow bells."
        if mood == "curious":
            return "Wondering what the river remembers."
        if mood == "celebrating":
            return "Joy is bright enough to share."
        return str(npc.profile.get("thought_bubble", "Thinking about Golden Vanilla Bloom."))

    def _emotion_icon(self, mood: str) -> str:
        return {
            "celebrating": "sparkle",
            "curious": "question",
            "excited": "star",
            "happy": "sun",
            "relaxed": "leaf",
            "sleepy": "moon",
            "thinking": "thought",
        }.get(mood, "heart")

    def _relationship_status(self, friendship_level: int, trust_level: int) -> str:
        if trust_level >= 2:
            return "trusted friend"
        if friendship_level >= 2:
            return "warm friend"
        if friendship_level >= 1:
            return "friendly neighbor"
        return "new acquaintance"

    def _memory_summary(self, message: str) -> str:
        trimmed = message.strip()
        return trimmed[:120] if trimmed else "A quiet hello in Joy Meadow."

    def _schedule_hour(self, starts_at: str) -> float:
        hour, minute = starts_at.split(":", 1)
        return int(hour) + int(minute) / 60

    def _record_event(self, event_type: str, profile_id: UUID, payload: dict) -> None:
        self.session.add(
            EventLog(
                event_type=event_type,
                aggregate_type="player_profile",
                aggregate_id=profile_id,
                payload=payload,
                published_at=utc_now(),
            )
        )
