import type { LumiEvent, LumiState } from "@/lib/lumi/lumi-types";

export type LumiMemory = {
  event: LumiEvent;
  message: string;
  occurredAt: string;
};

/** Keeps lightweight session memories that connect Lumi reactions to AI and gameplay events. */
export class LumiMemoryBridge {
  record(event: LumiEvent, state: LumiState): LumiMemory {
    return {
      event,
      message: state.message,
      occurredAt: new Date().toISOString()
    };
  }

  summarize(memories: LumiMemory[]) {
    return memories
      .slice(-3)
      .map((memory) => memory.message)
      .join(" ");
  }
}
