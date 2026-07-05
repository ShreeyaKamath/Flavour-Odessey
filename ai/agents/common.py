from ai.schemas import AgentText, GenerationResult


FORBIDDEN_MVP_REGIONS = (
    "wonder woods",
    "courage cliffs",
    "hope harbor",
    "home valley",
    "cream harbor",
    "bubble tea city",
    "chocolate volcano",
    "matcha temple",
    "rainbow observatory",
    "marshmallow peaks",
    "friendship falls",
)


def safe_agent_text(
    result: GenerationResult,
    fallback: str,
    max_length: int,
) -> AgentText:
    text = result.text.strip()
    unsafe = (
        not text
        or len(text) > max_length
        or any(region in text.lower() for region in FORBIDDEN_MVP_REGIONS)
    )
    if unsafe:
        return AgentText(text=fallback, provider="fallback", fallback_used=True)
    return AgentText(
        text=text,
        provider=result.provider,
        fallback_used=result.fallback_used,
    )
