import type { NpcChatResponse } from "@/lib/npcs/conversation-controller";

/** Selects the current speech bubble text and fallback status. */
export class SpeechBubbleSystem {
  constructor(
    private readonly fallbackText: string,
    private readonly response?: NpcChatResponse
  ) {}

  text() {
    return this.response?.reply ?? this.fallbackText;
  }

  usedFallback() {
    return Boolean(this.response?.fallback_used);
  }
}
