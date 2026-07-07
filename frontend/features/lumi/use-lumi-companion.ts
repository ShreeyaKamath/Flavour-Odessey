"use client";

import type { components } from "@flavor/contracts/api";
import { useEffect, useMemo, useState } from "react";

import type { NpcState } from "@/features/npcs/use-npcs";
import { audioEvents } from "@/lib/audio/audio-events";
import { LumiManager } from "@/lib/lumi/lumi-manager";
import type { LumiEvent, LumiState } from "@/lib/lumi/lumi-types";
import type { LivingWorldSnapshot } from "@/lib/world/weather-system";

type GameState = components["schemas"]["GameStateResponse"];

/** Owns the interactive Lumi companion state for the gameplay screen. */
export function useLumiCompanion(
  game: GameState | undefined,
  npcs?: NpcState[],
  companionResponse?: components["schemas"]["AICompanionRespondResponse"],
  companionError?: Error | null,
  world?: LivingWorldSnapshot
) {
  const manager = useMemo(() => new LumiManager(), []);
  const [state, setState] = useState<LumiState>(() => manager.stateMachine.initial());
  const [memories, setMemories] = useState(() => [manager.memory.record("idle", state)]);
  const context = game ? manager.context(game, npcs, companionResponse, world) : undefined;
  const hint = context
    ? manager.hints.nextHint(context)
    : "Lumi is finding the path to Joy Meadow.";

  function react(event: LumiEvent, message?: string) {
    setState((current) => {
      const next = manager.stateMachine.transition(current, event, message);
      setMemories((currentMemories) => [
        ...currentMemories.slice(-7),
        manager.memory.record(event, next)
      ]);
      return next;
    });

    if (event === "hint_requested") {
      audioEvents.publish("LumiHinted");
    }
    if (event === "ingredient_collected") {
      audioEvents.publish("LumiExcited");
    }
    if (event === "recipe_crafted" || event === "joy_restored") {
      audioEvents.publish("LumiCelebrated");
    }
    if (event === "sleep") {
      audioEvents.publish("LumiSlept");
    }
  }

  useEffect(() => {
    if (!companionResponse) {
      return;
    }
    react("hint_requested", companionResponse.response);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionResponse]);

  useEffect(() => {
    if (!companionError) {
      return;
    }
    react("ai_unavailable");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionError]);

  useEffect(() => {
    if (!world) {
      return;
    }
    react("weather_changed", world.lumiReaction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [world?.condition, world?.timeOfDay]);

  useEffect(() => {
    const handleVisibility = () => {
      react(document.hidden ? "sleep" : "wake");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    context,
    hint,
    memories,
    memorySummary: manager.memory.summarize(memories),
    react,
    state
  };
}
