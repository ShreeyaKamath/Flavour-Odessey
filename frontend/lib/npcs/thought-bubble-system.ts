import type { NpcState } from "@/features/npcs/use-npcs";

/** Supplies concise thought bubble copy from server-authored NPC state. */
export class ThoughtBubbleSystem {
  constructor(private readonly npc: NpcState) {}

  text() {
    return this.npc.thought_bubble;
  }
}
