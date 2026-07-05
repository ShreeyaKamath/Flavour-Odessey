from ai.agents.common import safe_agent_text
from ai.orchestrator import AIOrchestrator
from ai.prompts import journal_prompt
from ai.schemas import AgentText, GenerationRequest


class NarrativeHelper:
    CANONICAL_TITLE = "The Day Joy Returned"

    def __init__(self, orchestrator: AIOrchestrator) -> None:
        self.orchestrator = orchestrator

    async def write_journal_story(
        self,
        title: str,
        recipe_name: str,
        canonical_story: str,
    ) -> tuple[str, AgentText]:
        if title != self.CANONICAL_TITLE:
            raise ValueError("The canonical Joy Meadow journal title cannot change")
        mock_response = (
            "Golden Vanilla Bloom warmed the quiet meadow like a remembered "
            "sunrise. Laughter returned to the wind, and every flower opened "
            "as Joy found its way home."
        )
        result = await self.orchestrator.generate(
            GenerationRequest(
                task="journal_story",
                prompt=journal_prompt(title, recipe_name, canonical_story),
                fallback=canonical_story,
                context={"mock_response": mock_response},
            )
        )
        return title, safe_agent_text(result, canonical_story, max_length=1200)
