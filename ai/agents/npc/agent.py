from ai.agents.common import safe_agent_text
from ai.orchestrator import AIOrchestrator
from ai.prompts import npc_prompt
from ai.schemas import AgentText, GenerationRequest


class NPCAgent:
    def __init__(self, orchestrator: AIOrchestrator) -> None:
        self.orchestrator = orchestrator

    async def respond(
        self,
        npc_profile: dict,
        player_message: str,
        memories: list[str],
        quest_status: str,
        joy_meadow_lore: str,
        fallback: str,
    ) -> AgentText:
        mock_response = (
            "The meadow keeps every kindness like sunlight in a petal. "
            "Follow the first blooms, Flavor Keeper."
        )
        result = await self.orchestrator.generate(
            GenerationRequest(
                task="npc_chat",
                prompt=npc_prompt(
                    npc_profile,
                    player_message,
                    memories,
                    quest_status,
                    joy_meadow_lore,
                ),
                fallback=fallback,
                context={"mock_response": mock_response},
            )
        )
        return safe_agent_text(result, fallback, max_length=320)
