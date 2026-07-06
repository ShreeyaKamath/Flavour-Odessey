import type { AudioId } from "@/lib/audio/manifest";
import type { AudioPlaybackEngine } from "@/lib/audio/types";

/** Controls the active environmental ambience layer. */
export class AmbientManager {
  constructor(private readonly engine: AudioPlaybackEngine) {}

  enter(audioId: AudioId) {
    return this.engine.playAsset(audioId, "ambient");
  }

  leave() {
    this.engine.stopBus("ambient");
  }
}
