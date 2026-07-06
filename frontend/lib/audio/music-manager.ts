import type { AudioId } from "@/lib/audio/manifest";
import type { AudioPlaybackEngine } from "@/lib/audio/types";

/** Controls the active music layer through the shared playback engine. */
export class MusicManager {
  constructor(private readonly engine: AudioPlaybackEngine) {}

  play(audioId: AudioId) {
    return this.engine.playAsset(audioId, "music");
  }

  stop() {
    this.engine.stopBus("music");
  }
}
