from typing import Protocol, runtime_checkable

from ai.schemas import GenerationRequest


class LLMProviderError(RuntimeError):
    """Raised when a configured provider cannot return a usable response."""


@runtime_checkable
class FutureLLMProvider(Protocol):
    """Interface future hosted or local LLM providers must implement."""

    name: str

    async def generate(self, request: GenerationRequest) -> str:
        """Generate one text response for an agent request."""

