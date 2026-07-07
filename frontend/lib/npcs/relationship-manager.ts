import type { NpcState } from "@/features/npcs/use-npcs";

/** Computes display-ready friendship and trust progress from server state. */
export class RelationshipManager {
  constructor(private readonly npc: NpcState) {}

  friendshipPercent() {
    return Math.min(100, (this.npc.relationship.friendship_xp % 25) * 4);
  }

  trustPercent() {
    return Math.min(100, (this.npc.relationship.trust_xp % 25) * 4);
  }

  headline() {
    return `${this.npc.relationship.relationship_status} · Friendship ${this.npc.relationship.friendship_level}`;
  }
}
