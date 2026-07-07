import type { components } from "@flavor/contracts/api";

import type { NpcState } from "@/features/npcs/use-npcs";

export type NpcChatResponse = components["schemas"]["AINpcChatResponse"];

/** Prepares NPC conversation text and memory snippets for storybook dialogue. */
export class ConversationController {
  constructor(
    private readonly npc: NpcState,
    private readonly latestResponse?: NpcChatResponse
  ) {}

  activeText() {
    return this.latestResponse?.reply ?? this.npc.speech_bubble;
  }

  memoryReferences() {
    const memories = this.latestResponse?.relationship?.memory_highlights;
    return memories?.length ? memories : this.npc.relationship.memory_highlights;
  }

  history() {
    return (
      this.latestResponse?.relationship?.conversation_history ??
      this.npc.relationship.conversation_history
    );
  }
}
