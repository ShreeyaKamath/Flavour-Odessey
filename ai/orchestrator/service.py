import asyncio

from ai.providers import FutureLLMProvider
from ai.schemas import GenerationRequest, GenerationResult


class AIOrchestrator:
    def __init__(
        self,
        provider: FutureLLMProvider,
        timeout_seconds: float = 2.0,
        max_retries: int = 1,
    ) -> None:
        self.provider = provider
        self.timeout_seconds = max(timeout_seconds, 0.01)
        self.max_retries = max(max_retries, 0)

    async def generate(self, request: GenerationRequest) -> GenerationResult:
        attempts = 0
        for _ in range(self.max_retries + 1):
            attempts += 1
            try:
                text = await asyncio.wait_for(
                    self.provider.generate(request),
                    timeout=self.timeout_seconds,
                )
                if not text.strip():
                    raise ValueError("Provider returned empty text")
                return GenerationResult(
                    text=text.strip(),
                    provider=self.provider.name,
                    fallback_used=False,
                    attempts=attempts,
                )
            except Exception:
                continue
        return GenerationResult(
            text=request.fallback,
            provider="fallback",
            fallback_used=True,
            attempts=attempts,
        )
