from ai.agents.common import safe_agent_text
from ai.orchestrator import AIOrchestrator
from ai.prompts import recipe_prompt
from ai.schemas import AgentText, GenerationRequest


class RecipeAgent:
    def __init__(self, orchestrator: AIOrchestrator) -> None:
        self.orchestrator = orchestrator

    async def describe(
        self,
        name: str,
        ingredients: list[str],
        emotion: str,
        canonical_lore: str,
    ) -> AgentText:
        if name != "Golden Vanilla Bloom":
            raise ValueError("Only Golden Vanilla Bloom is available in the MVP")
        if ingredients != ["vanilla_orchid", "honey_bloom"] or emotion != "joy":
            raise ValueError("Recipe generation cannot change canonical rules")
        mock_response = (
            "Golden Vanilla Bloom carries the hush of vanilla petals and the "
            "warmth of honeyed sunlight, preserving Joy in every golden spoonful."
        )
        result = await self.orchestrator.generate(
            GenerationRequest(
                task="recipe_description",
                prompt=recipe_prompt(name, ingredients, emotion, canonical_lore),
                fallback=canonical_lore,
                context={"mock_response": mock_response},
            )
        )
        return safe_agent_text(result, canonical_lore, max_length=520)
