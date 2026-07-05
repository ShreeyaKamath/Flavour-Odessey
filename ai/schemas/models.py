from dataclasses import dataclass, field
from datetime import datetime
from typing import Any


@dataclass(frozen=True)
class GenerationRequest:
    task: str
    prompt: str
    fallback: str
    context: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class GenerationResult:
    text: str
    provider: str
    fallback_used: bool
    attempts: int


@dataclass(frozen=True)
class AgentText:
    text: str
    provider: str
    fallback_used: bool


@dataclass(frozen=True)
class MemoryEntry:
    player_id: str
    npc_id: str
    content: str
    importance: int
    memory_type: str = "interaction"
    id: str | None = None
    created_at: datetime | None = None
