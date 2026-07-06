import { AmbientManager } from "@/lib/audio/ambient-manager";
import { audioManifest, type AudioId } from "@/lib/audio/manifest";
import { MusicManager } from "@/lib/audio/music-manager";
import { SFXManager } from "@/lib/audio/sfx-manager";
import type {
  AudioBus,
  AudioElementLike,
  AudioFactory,
  AudioManifest,
  AudioManifestAsset,
  AudioMixerSettings,
  AudioPlaybackEngine
} from "@/lib/audio/types";
import { defaultAudioSettings, VolumeMixer } from "@/lib/audio/volume-mixer";

type ActivePlayback = {
  asset: AudioManifestAsset;
  element: AudioElementLike;
};

function createBrowserAudio(source: string): AudioElementLike | null {
  if (typeof Audio === "undefined") {
    return null;
  }
  return new Audio(source);
}

/** Coordinates manifest lookup, autoplay unlock, buses, and active playback. */
export class AudioManager implements AudioPlaybackEngine {
  readonly ambient: AmbientManager;
  readonly music: MusicManager;
  readonly sfx: SFXManager;

  private readonly active = new Map<AudioElementLike, ActivePlayback>();
  private readonly desiredLoops = new Map<AudioBus, AudioId>();
  private readonly loopElements = new Map<AudioBus, AudioElementLike>();
  private readonly mixer = new VolumeMixer();
  private unlocked = false;

  constructor(
    private readonly manifest: AudioManifest = audioManifest,
    private readonly createAudio: AudioFactory = createBrowserAudio
  ) {
    this.ambient = new AmbientManager(this);
    this.music = new MusicManager(this);
    this.sfx = new SFXManager(this);
    this.mixer.update(defaultAudioSettings);
  }

  async unlock() {
    if (this.unlocked) {
      return true;
    }
    if (!this.mixer.snapshot().enabled) {
      return false;
    }

    const source = Object.values(this.manifest.sources)[0];
    const probe = source ? this.createAudio(source.src) : null;
    if (!probe) {
      return false;
    }

    probe.volume = 0;
    probe.preload = "auto";
    try {
      await probe.play();
      probe.pause();
      probe.currentTime = 0;
      this.unlocked = true;
      this.replayDesiredLoops();
      return true;
    } catch {
      probe.pause();
      return false;
    }
  }

  isUnlocked() {
    return this.unlocked;
  }

  setMixerSettings(settings: AudioMixerSettings) {
    const wasEnabled = this.mixer.snapshot().enabled;
    this.mixer.update(settings);

    if (!settings.enabled) {
      this.stopActivePlayback();
      return;
    }

    this.active.forEach(({ asset, element }) => {
      element.volume = this.mixer.gain(asset.bus, asset.default_volume);
    });
    if (!wasEnabled && this.unlocked) {
      this.replayDesiredLoops();
    }
  }

  getMixerSettings() {
    return this.mixer.snapshot();
  }

  playAsset(audioId: string, expectedBus: AudioBus) {
    const asset = this.manifest.assets[audioId];
    if (!asset || asset.bus !== expectedBus) {
      return false;
    }

    if (asset.loop) {
      this.desiredLoops.set(expectedBus, audioId as AudioId);
    }
    if (!this.unlocked || !this.mixer.snapshot().enabled) {
      return false;
    }

    return this.startPlayback(asset);
  }

  stopBus(bus: AudioBus) {
    this.desiredLoops.delete(bus);
    this.stopActiveBus(bus);
  }

  dispose() {
    this.desiredLoops.clear();
    this.stopActivePlayback();
    this.unlocked = false;
  }

  private startPlayback(asset: AudioManifestAsset) {
    const source = this.manifest.sources[asset.source];
    if (!source) {
      return false;
    }

    if (asset.loop) {
      this.stopActiveBus(asset.bus);
    }

    const element = this.createAudio(source.src);
    if (!element) {
      return false;
    }

    element.currentTime = 0;
    element.loop = asset.loop && !source.generated;
    element.preload = asset.loop ? "auto" : "metadata";
    element.volume = this.mixer.gain(asset.bus, asset.default_volume);
    this.active.set(element, { asset, element });
    if (asset.loop) {
      this.loopElements.set(asset.bus, element);
    }
    element.addEventListener?.("ended", () => this.releaseElement(element), { once: true });

    try {
      const playback = element.play();
      if (playback instanceof Promise) {
        void playback.catch(() => this.releaseElement(element));
      }
      return true;
    } catch {
      this.releaseElement(element);
      return false;
    }
  }

  private replayDesiredLoops() {
    [...this.desiredLoops.entries()].forEach(([bus, audioId]) => {
      const asset = this.manifest.assets[audioId];
      if (asset?.bus === bus) {
        this.startPlayback(asset);
      }
    });
  }

  private releaseElement(element: AudioElementLike) {
    const active = this.active.get(element);
    if (!active) {
      return;
    }
    element.pause();
    this.active.delete(element);
    if (this.loopElements.get(active.asset.bus) === element) {
      this.loopElements.delete(active.asset.bus);
    }
  }

  private stopActiveBus(bus: AudioBus) {
    const elements = [...this.active.values()]
      .filter(({ asset }) => asset.bus === bus)
      .map(({ element }) => element);
    elements.forEach((element) => this.releaseElement(element));
  }

  private stopActivePlayback() {
    [...this.active.keys()].forEach((element) => this.releaseElement(element));
  }
}

export const audioManager = new AudioManager();
