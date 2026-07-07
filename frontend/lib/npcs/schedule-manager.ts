import type { NpcState } from "@/features/npcs/use-npcs";

/** Reads server-authored NPC schedules and movement interpolation state. */
export class ScheduleManager {
  constructor(private readonly npc: NpcState) {}

  activeStep() {
    return (
      this.npc.daily_schedule.find((step) => step.activity === this.npc.current_activity) ??
      this.npc.daily_schedule[0]
    );
  }

  movementLabel() {
    const percent = Math.round(this.npc.movement.progress * 100);
    return `${this.npc.movement.from_location} to ${this.npc.movement.to_location} (${percent}%)`;
  }

  isSleeping() {
    return this.npc.current_activity === "Sleep";
  }
}
