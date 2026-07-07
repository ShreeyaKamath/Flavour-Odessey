import type { NpcState } from "@/features/npcs/use-npcs";

/** Provides relationship milestones and meters for the NPC storybook UI. */
export class FriendshipSystem {
  constructor(private readonly npc: NpcState) {}

  milestoneLabel() {
    return this.npc.relationship.milestones[0] ?? "First Hello";
  }

  hasMemories() {
    return this.npc.relationship.memory_highlights.length > 0;
  }
}
