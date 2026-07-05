from collections.abc import Mapping

from ai.schemas import GenerationRequest


class MockLLMProvider:
    name = "mock"

    def __init__(
        self,
        responses: Mapping[str, str] | None = None,
        failures_before_success: int = 0,
    ) -> None:
        self.responses = dict(responses or {})
        self.failures_before_success = failures_before_success
        self.calls = 0
        self.requests: list[GenerationRequest] = []

    async def generate(self, request: GenerationRequest) -> str:
        self.calls += 1
        self.requests.append(request)
        if self.calls <= self.failures_before_success:
            raise RuntimeError("Deterministic mock provider failure")
        return self.responses.get(
            request.task,
            str(request.context.get("mock_response") or request.fallback),
        )
