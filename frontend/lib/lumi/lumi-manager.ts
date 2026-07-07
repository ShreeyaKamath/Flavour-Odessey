import type { components } from "@flavor/contracts/api";

import type { NpcState } from "@/features/npcs/use-npcs";
import { LumiHintController } from "@/lib/lumi/lumi-hint-controller";
import { LumiMemoryBridge } from "@/lib/lumi/lumi-memory-bridge";
import { LumiStateMachine } from "@/lib/lumi/lumi-state-machine";
import type { LumiContext } from "@/lib/lumi/lumi-types";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type GameState = components["schemas"]["GameStateResponse"];

/** Coordinates Lumi state, hints, and memory bridges for the Joy Meadow frontend. */
export class LumiManager {
  readonly hints = new LumiHintController();
  readonly memory = new LumiMemoryBridge();
  readonly stateMachine = new LumiStateMachine();

  context(
    game: GameState,
    npcs: NpcState[] | undefined,
    companionResponse?: components["schemas"]["AICompanionRespondResponse"],
    world?: LivingWorldSnapshot
  ): LumiContext {
    const currentNpc = npcs?.[0];
    const fallbackWorld = this.fallbackWorld();
    return {
      companionResponse,
      craftingActive: game.recipe.can_craft && !game.recipe.crafted,
      currentNpcName: currentNpc?.name,
      game,
      npcNearby: Boolean(currentNpc),
      timeOfDay: world?.timeOfDay ?? fallbackWorld.timeOfDay,
      weather: world?.condition ?? fallbackWorld.condition,
      weatherLabel: world?.conditionLabel ?? fallbackWorld.conditionLabel,
      world
    };
  }

  private fallbackWorld() {
    const now = new Date();
    const timeOfDay = this.timeOfDay(now);
    return {
      condition:
        timeOfDay === "night" ? "night" : timeOfDay === "golden_hour" ? "golden_hour" : "sunny",
      conditionLabel:
        timeOfDay === "night" ? "Night" : timeOfDay === "golden_hour" ? "Golden hour" : "Sunny",
      timeOfDay
    } as const;
  }

  private timeOfDay(now: Date): LumiContext["timeOfDay"] {
    const hour = now.getHours();
    if (hour < 6 || hour >= 21) {
      return "night";
    }
    if (hour >= 20) {
      return "evening";
    }
    if (hour >= 17) {
      return "golden_hour";
    }
    if (hour >= 12) {
      return "afternoon";
    }
    return "morning";
  }
}
