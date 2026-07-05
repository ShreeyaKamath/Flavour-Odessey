export type AudioChannel = "master" | "music" | "sfx" | "voice";

export type AudioState = Record<AudioChannel, number>;

export class AudioManager {
  private volumes: AudioState = {
    master: 1,
    music: 0.8,
    sfx: 0.8,
    voice: 0.8
  };

  setVolume(channel: AudioChannel, value: number) {
    this.volumes[channel] = Math.min(1, Math.max(0, value));
  }

  getVolumes() {
    return this.volumes;
  }

  playPlaceholder(audioId: string) {
    void audioId;
    return;
  }
}

export const audioManager = new AudioManager();
