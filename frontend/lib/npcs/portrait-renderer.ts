import type { NpcState } from "@/features/npcs/use-npcs";

/** Converts manifest portrait keys into deterministic painted-placeholder initials. */
export class PortraitRenderer {
  constructor(private readonly npc: NpcState) {}

  initials() {
    return this.npc.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  label() {
    return `${this.npc.name} portrait, ${this.npc.current_mood}`;
  }
}
