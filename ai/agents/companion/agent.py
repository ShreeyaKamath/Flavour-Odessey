from ai.agents.common import safe_agent_text
from ai.orchestrator import AIOrchestrator
from ai.prompts import companion_prompt
from ai.schemas import AgentText, GenerationRequest


class CompanionAgent:
    MOCK_RESPONSES = {
        "hint": "The Vanilla Orchid and Honey Bloom are glowing nearby. Let us gather both!",
        "ingredient_collected": "That bloom remembers the sun. We are one step closer!",
        "recipe_crafted": "Golden Vanilla Bloom! I can hear Joy waking beneath the meadow.",
        "joy_restored": "You did it! Every flower is singing Joy back into the wind.",
    }

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        self.orchestrator = orchestrator

    async def respond(
        self,
        event: str,
        quest_status: str,
        restored: bool,
        fallback: str,
    ) -> AgentText:
        result = await self.orchestrator.generate(
            GenerationRequest(
                task="companion_response",
                prompt=companion_prompt(event, quest_status, restored),
                fallback=fallback,
                context={
                    "mock_response": self.MOCK_RESPONSES.get(event, fallback),
                },
            )
        )
        return safe_agent_text(result, fallback, max_length=240)
