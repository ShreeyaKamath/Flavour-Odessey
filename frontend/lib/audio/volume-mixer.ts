import type { AudioBus, AudioMixerSettings } from "@/lib/audio/types";

export const defaultAudioSettings: AudioMixerSettings = {
  ambient: 0.75,
  enabled: true,
  master: 1,
  music: 0.7,
  muted: false,
  sfx: 0.8
};

function clampVolume(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Calculates effective gain for each independent audio bus. */
export class VolumeMixer {
  private settings: AudioMixerSettings = { ...defaultAudioSettings };

  update(settings: AudioMixerSettings) {
    this.settings = {
      ambient: clampVolume(settings.ambient),
      enabled: settings.enabled,
      master: clampVolume(settings.master),
      music: clampVolume(settings.music),
      muted: settings.muted,
      sfx: clampVolume(settings.sfx)
    };
  }

  gain(bus: AudioBus, assetVolume: number) {
    if (!this.settings.enabled || this.settings.muted) {
      return 0;
    }
    return clampVolume(this.settings.master * this.settings[bus] * clampVolume(assetVolume));
  }

  snapshot() {
    return { ...this.settings };
  }
}
