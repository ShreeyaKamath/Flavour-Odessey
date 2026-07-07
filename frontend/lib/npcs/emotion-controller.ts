import type { NpcState } from "@/features/npcs/use-npcs";

export const emotionTone = {
  celebrating: "text-accent",
  confused: "text-muted-foreground",
  curious: "text-accent",
  embarrassed: "text-secondary",
  excited: "text-accent",
  happy: "text-accent",
  proud: "text-accent",
  relaxed: "text-muted-foreground",
  sad: "text-danger",
  sleepy: "text-muted-foreground",
  surprised: "text-accent",
  thinking: "text-secondary"
} as const;

/** Maps NPC emotion state into UI tone and pacing hints. */
export class EmotionController {
  constructor(private readonly npc: NpcState) {}

  toneClass() {
    return emotionTone[this.npc.current_mood as keyof typeof emotionTone] ?? "text-accent";
  }

  typingDelayMs() {
    if (this.npc.speech_speed === "slow") {
      return 42;
    }
    if (this.npc.speech_speed === "bright") {
      return 18;
    }
    return 28;
  }
}
