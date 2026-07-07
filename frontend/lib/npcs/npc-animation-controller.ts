import type { NpcState } from "@/features/npcs/use-npcs";

/** Chooses lightweight CSS animation state names for living NPC rendering. */
export class NPCAnimationController {
  constructor(private readonly npc: NpcState) {}

  stateClass() {
    if (this.npc.animation_state === "sleeping") {
      return "animate-[npc-breathe_4s_ease-in-out_infinite]";
    }
    if (this.npc.animation_state === "walk") {
      return "animate-[npc-walk_1.8s_ease-in-out_infinite]";
    }
    if (this.npc.animation_state === "celebrate") {
      return "animate-[npc-celebrate_1.2s_ease-in-out_infinite]";
    }
    return "animate-[npc-breathe_3s_ease-in-out_infinite]";
  }
}
