import asyncio

import pytest

from ai.agents import CompanionAgent, MemoryAgent, NarrativeHelper, NPCAgent, RecipeAgent
from ai.agents.memory import MemoryStore
from ai.orchestrator import AIOrchestrator
from ai.providers import FutureLLMProvider, MockLLMProvider
from ai.providers.factory import DeferredLLMProvider
from ai.schemas import GenerationRequest, MemoryEntry


pytestmark = pytest.mark.asyncio


class InMemoryStore(MemoryStore):
    def __init__(self) -> None:
        self.entries: list[MemoryEntry] = []

    async def list_memories(
        self,
        player_id: str,
        npc_id: str,
        limit: int,
    ) -> list[MemoryEntry]:
        matches = [
            entry
            for entry in self.entries
            if entry.player_id == player_id and entry.npc_id == npc_id
        ]
        return sorted(
            matches,
            key=lambda entry: entry.importance,
            reverse=True,
        )[:limit]

    async def add_memory(self, entry: MemoryEntry) -> MemoryEntry:
        self.entries.append(entry)
        return entry


async def test_mock_provider_retries_deterministically() -> None:
    provider = MockLLMProvider(
        responses={"npc_chat": "A warm answer."},
        failures_before_success=1,
    )
    agent = NPCAgent(AIOrchestrator(provider, max_retries=1))

    result = await agent.respond(
        npc_profile={"tone": "warm"},
        player_message="Can you help?",
        memories=[],
        quest_status="active",
        joy_meadow_lore="A meadow remembering Joy.",
        fallback="The meadow is listening.",
    )

    assert result.text == "A warm answer."
    assert result.provider == "mock"
    assert result.fallback_used is False
    assert provider.calls == 2


async def test_memory_agent_reads_writes_and_scores_player_scoped_memory() -> None:
    store = InMemoryStore()
    agent = MemoryAgent(store)

    ignored = await agent.remember("player-1", "npc-1", "Hello there")
    written = await agent.remember(
        "player-1",
        "npc-1",
        "I promise to restore Joy and remember this recipe.",
    )
    await agent.remember(
        "player-2",
        "npc-1",
        "I promise to restore Joy for another player.",
    )
    memories = await agent.read("player-1", "npc-1")

    assert ignored is None
    assert written is not None
    assert written.importance >= 4
    assert [memory.player_id for memory in memories] == ["player-1"]


async def test_npc_agent_rejects_out_of_scope_islands() -> None:
    provider = MockLLMProvider(
        responses={"npc_chat": "Let us leave for Wonder Woods."}
    )
    agent = NPCAgent(AIOrchestrator(provider))

    result = await agent.respond(
        npc_profile={"tone": "warm"},
        player_message="Where should I go?",
        memories=[],
        quest_status="active",
        joy_meadow_lore="Joy Meadow is quiet.",
        fallback="The meadow blooms are waiting nearby.",
    )

    assert result.text == "The meadow blooms are waiting nearby."
    assert result.fallback_used is True


async def test_npc_agent_includes_player_memory_in_prompt() -> None:
    provider = MockLLMProvider()
    agent = NPCAgent(AIOrchestrator(provider))

    await agent.respond(
        npc_profile={"tone": "warm"},
        player_message="Do you remember?",
        memories=["The player promised to restore the first scoop."],
        quest_status="active",
        joy_meadow_lore="Joy Meadow is quiet.",
        fallback="The meadow remembers.",
    )

    assert "promised to restore the first scoop" in provider.requests[0].prompt


async def test_companion_agent_generates_event_response() -> None:
    agent = CompanionAgent(AIOrchestrator(MockLLMProvider()))

    result = await agent.respond(
        event="recipe_crafted",
        quest_status="active",
        restored=False,
        fallback="The recipe is ready.",
    )

    assert "Joy" in result.text
    assert result.provider == "mock"


async def test_recipe_agent_preserves_canonical_rules() -> None:
    agent = RecipeAgent(AIOrchestrator(MockLLMProvider()))

    result = await agent.describe(
        name="Golden Vanilla Bloom",
        ingredients=["vanilla_orchid", "honey_bloom"],
        emotion="joy",
        canonical_lore="A flavor that remembers sunlight.",
    )

    assert "Golden Vanilla Bloom" in result.text
    assert result.fallback_used is False


async def test_narrative_helper_preserves_canonical_title() -> None:
    helper = NarrativeHelper(AIOrchestrator(MockLLMProvider()))

    title, result = await helper.write_journal_story(
        title="The Day Joy Returned",
        recipe_name="Golden Vanilla Bloom",
        canonical_story="Joy returned to the meadow.",
    )

    assert title == "The Day Joy Returned"
    assert "Joy" in result.text


async def test_unavailable_provider_uses_deterministic_fallback() -> None:
    agent = NPCAgent(AIOrchestrator(DeferredLLMProvider(), max_retries=1))

    result = await agent.respond(
        npc_profile={},
        player_message="Hello",
        memories=[],
        quest_status="not_started",
        joy_meadow_lore="Joy Meadow",
        fallback="The meadow is listening, Flavor Keeper.",
    )

    assert result.text == "The meadow is listening, Flavor Keeper."
    assert result.provider == "fallback"
    assert result.fallback_used is True


async def test_provider_timeout_uses_deterministic_fallback() -> None:
    class SlowProvider(FutureLLMProvider):
        name = "slow"

        async def generate(self, _request: GenerationRequest) -> str:
            await asyncio.sleep(0.1)
            return "Too late"

    agent = NPCAgent(
        AIOrchestrator(SlowProvider(), timeout_seconds=0.01, max_retries=0)
    )

    result = await agent.respond(
        npc_profile={},
        player_message="Hello",
        memories=[],
        quest_status="not_started",
        joy_meadow_lore="Joy Meadow",
        fallback="The meadow is listening, Flavor Keeper.",
    )

    assert result.text == "The meadow is listening, Flavor Keeper."
    assert result.fallback_used is True
