from typing import Protocol

from ai.schemas import MemoryEntry


class MemoryStore(Protocol):
    async def list_memories(
        self,
        player_id: str,
        npc_id: str,
        limit: int,
    ) -> list[MemoryEntry]: ...

    async def add_memory(self, entry: MemoryEntry) -> MemoryEntry: ...


class MemoryAgent:
    IMPORTANT_WORDS = (
        "helped",
        "promise",
        "quest",
        "recipe",
        "remember",
        "restore",
        "returned",
        "saved",
    )

    def __init__(self, store: MemoryStore) -> None:
        self.store = store

    async def read(
        self,
        player_id: str,
        npc_id: str,
        limit: int = 5,
    ) -> list[MemoryEntry]:
        return await self.store.list_memories(player_id, npc_id, limit)

    async def remember(
        self,
        player_id: str,
        npc_id: str,
        content: str,
        memory_type: str = "interaction",
    ) -> MemoryEntry | None:
        importance = self.score_importance(content)
        if importance < 4:
            return None
        return await self.store.add_memory(
            MemoryEntry(
                player_id=player_id,
                npc_id=npc_id,
                content=content.strip(),
                importance=importance,
                memory_type=memory_type,
            )
        )

    @classmethod
    def score_importance(cls, content: str) -> int:
        normalized = content.lower()
        keyword_score = sum(word in normalized for word in cls.IMPORTANT_WORDS)
        length_score = 2 if len(content.strip()) >= 80 else int(len(content.strip()) >= 35)
        return min(10, 1 + keyword_score * 2 + length_score)
