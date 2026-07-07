import type { components } from "@flavor/contracts/api";

export type LumiEmotion =
  "happy" | "curious" | "excited" | "sleepy" | "proud" | "worried" | "celebrating" | "thoughtful";

export type LumiMode = "idle" | "following" | "thinking" | "reacting" | "sleeping";

export type LumiEvent =
  | "idle"
  | "hint_requested"
  | "ingredient_collected"
  | "recipe_crafted"
  | "joy_restored"
  | "npc_conversation"
  | "crafting_started"
  | "sleep"
  | "wake"
  | "ai_unavailable";

export type LumiState = {
  emotion: LumiEmotion;
  mode: LumiMode;
  message: string;
  lastEvent: LumiEvent;
  sleeping: boolean;
};

export type LumiContext = {
  companionResponse?: components["schemas"]["AICompanionRespondResponse"];
  craftingActive: boolean;
  currentNpcName?: string;
  game: components["schemas"]["GameStateResponse"];
  npcNearby: boolean;
  timeOfDay: "morning" | "afternoon" | "golden_hour" | "night";
  weather: string;
};
