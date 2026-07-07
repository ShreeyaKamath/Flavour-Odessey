import type { LumiEvent, LumiState } from "@/lib/lumi/lumi-types";

const DEFAULT_MESSAGE = "I am right here, floating beside the next bright idea.";

/** Resolves Lumi's compact companion state from gameplay and interaction events. */
export class LumiStateMachine {
  initial(): LumiState {
    return {
      emotion: "happy",
      lastEvent: "idle",
      message: DEFAULT_MESSAGE,
      mode: "idle",
      sleeping: false
    };
  }

  transition(current: LumiState, event: LumiEvent, message?: string): LumiState {
    if (event === "sleep") {
      return {
        ...current,
        emotion: "sleepy",
        lastEvent: event,
        message: message ?? "Wake me when the meadow whispers again.",
        mode: "sleeping",
        sleeping: true
      };
    }

    if (event === "wake") {
      return {
        ...current,
        emotion: "happy",
        lastEvent: event,
        message: message ?? "I am awake. The meadow feels sparkly today.",
        mode: "following",
        sleeping: false
      };
    }

    if (current.sleeping) {
      return current;
    }

    const eventState: Record<Exclude<LumiEvent, "sleep" | "wake">, Omit<LumiState, "sleeping">> = {
      ai_unavailable: {
        emotion: "worried",
        lastEvent: event,
        message: message ?? "The star path is quiet, but I still remember the way.",
        mode: "reacting"
      },
      crafting_started: {
        emotion: "excited",
        lastEvent: event,
        message: message ?? "I will circle the magic while the ingredients rise.",
        mode: "reacting"
      },
      hint_requested: {
        emotion: "thoughtful",
        lastEvent: event,
        message: message ?? "Let me listen to the meadow for a tiny clue.",
        mode: "thinking"
      },
      idle: {
        emotion: "happy",
        lastEvent: event,
        message: message ?? DEFAULT_MESSAGE,
        mode: "idle"
      },
      ingredient_collected: {
        emotion: "excited",
        lastEvent: event,
        message: message ?? "That ingredient lit up when you touched it!",
        mode: "reacting"
      },
      joy_restored: {
        emotion: "proud",
        lastEvent: event,
        message: message ?? "You brought Joy back. I am glowing all the way through.",
        mode: "reacting"
      },
      weather_changed: {
        emotion: "curious",
        lastEvent: event,
        message: message ?? "The meadow air changed. I will glow where the path gets soft.",
        mode: "following"
      },
      npc_conversation: {
        emotion: "curious",
        lastEvent: event,
        message: message ?? "I love hearing the meadow voices remember you.",
        mode: "following"
      },
      recipe_crafted: {
        emotion: "celebrating",
        lastEvent: event,
        message: message ?? "Golden Vanilla Bloom! That was real meadow magic.",
        mode: "reacting"
      }
    };

    return {
      ...eventState[event],
      sleeping: false
    };
  }
}
