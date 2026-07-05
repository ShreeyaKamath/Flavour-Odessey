from collections.abc import Awaitable, Callable
from typing import Any


EventHandler = Callable[[dict[str, Any]], Awaitable[None]]


class EventBus:
    """Placeholder async event bus for future service decoupling."""

    def __init__(self) -> None:
        self._handlers: dict[str, list[EventHandler]] = {}

    def subscribe(self, event_type: str, handler: EventHandler) -> None:
        self._handlers.setdefault(event_type, []).append(handler)

    async def publish(self, event_type: str, payload: dict[str, Any]) -> None:
        for handler in self._handlers.get(event_type, []):
            await handler(payload)


event_bus = EventBus()
