import type { AudioId } from "@/lib/audio/manifest";
import type { AudioPlaybackEngine } from "@/lib/audio/types";

/** Plays short, overlapping UI and gameplay effects. */
export class SFXManager {
  constructor(private readonly engine: AudioPlaybackEngine) {}

  play(audioId: AudioId) {
    return this.engine.playAsset(audioId, "sfx");
  }
}
