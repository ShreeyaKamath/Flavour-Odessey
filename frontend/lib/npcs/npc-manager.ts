import type { NpcState } from "@/features/npcs/use-npcs";

export const npcRosterOrder = [
  "joy_meadow_keeper",
  "joy_meadow_baker",
  "joy_meadow_gardener",
  "joy_meadow_child_explorer",
  "joy_meadow_traveling_merchant"
] as const;

/** Sorts and filters the Joy Meadow living village roster. */
export class NPCManager {
  constructor(private readonly npcs: NpcState[]) {}

  ordered() {
    return [...this.npcs].sort(
      (first, second) =>
        npcRosterOrder.indexOf(first.npc_id) - npcRosterOrder.indexOf(second.npc_id)
    );
  }

  byId(npcId: NpcState["npc_id"]) {
    return this.npcs.find((npc) => npc.npc_id === npcId) ?? this.ordered()[0];
  }
}
