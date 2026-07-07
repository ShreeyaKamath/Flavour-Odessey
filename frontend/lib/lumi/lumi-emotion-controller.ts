import type { LumiEmotion } from "@/lib/lumi/lumi-types";

const emotionLabels: Record<LumiEmotion, string> = {
  celebrating: "Celebrating",
  curious: "Curious",
  excited: "Excited",
  happy: "Happy",
  proud: "Proud",
  sleepy: "Sleepy",
  thoughtful: "Thoughtful",
  worried: "Worried"
};

const expressionClasses: Record<LumiEmotion, string> = {
  celebrating: "shadow-glow ring-2 ring-accent",
  curious: "shadow-panel ring-1 ring-info",
  excited: "shadow-glow ring-2 ring-warning",
  happy: "shadow-glow ring-1 ring-accent",
  proud: "shadow-glow ring-2 ring-success",
  sleepy: "shadow-panel opacity-80 ring-1 ring-muted",
  thoughtful: "shadow-panel ring-1 ring-accent",
  worried: "shadow-panel ring-1 ring-danger"
};

/** Maps Lumi emotions to accessible labels and token-driven styling hooks. */
export class LumiEmotionController {
  constructor(private readonly emotion: LumiEmotion) {}

  label() {
    return emotionLabels[this.emotion];
  }

  expressionClass() {
    return expressionClasses[this.emotion];
  }

  ariaLabel() {
    return `Lumi companion, ${this.label().toLowerCase()}`;
  }

  isBright() {
    return ["celebrating", "excited", "proud"].includes(this.emotion);
  }
}
