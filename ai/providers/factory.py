from ai.providers.base import FutureLLMProvider, LLMProviderError
from ai.providers.mock import MockLLMProvider
from ai.schemas import GenerationRequest


class DeferredLLMProvider:
    """Placeholder for a future real provider implementation."""

    name = "future"

    async def generate(self, _request: GenerationRequest) -> str:
        raise LLMProviderError("The future LLM provider is not configured")


def create_llm_provider(
    provider_name: str,
    deterministic: bool = False,
) -> FutureLLMProvider:
    normalized = provider_name.strip().lower()
    if deterministic or normalized == "mock":
        return MockLLMProvider()
    if normalized == "future":
        return DeferredLLMProvider()
    raise ValueError(f"Unsupported AI provider: {provider_name}")
