export type AudioBus = "music" | "sfx" | "ambient";
export type AudioMixerChannel = "master" | AudioBus;

export type AudioMixerSettings = Record<AudioMixerChannel, number> & {
  enabled: boolean;
  muted: boolean;
};

export type AudioManifestAsset = {
  bus: AudioBus;
  default_volume: number;
  loop: boolean;
  source: string;
};

export type AudioManifestSource = {
  generated: boolean;
  mime_type: string;
  src: string;
};

export type AudioManifest = {
  version: number;
  assets: Record<string, AudioManifestAsset>;
  sources: Record<string, AudioManifestSource>;
};

export type AudioElementLike = {
  currentTime: number;
  loop: boolean;
  preload: string;
  volume: number;
  addEventListener?: (event: "ended", listener: () => void, options?: { once?: boolean }) => void;
  pause: () => void;
  play: () => Promise<void> | void;
};

export type AudioFactory = (source: string) => AudioElementLike | null;

export type AudioPlaybackEngine = {
  playAsset: (audioId: string, expectedBus: AudioBus) => boolean;
  stopBus: (bus: AudioBus) => void;
};
