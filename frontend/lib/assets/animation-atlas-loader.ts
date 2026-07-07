import { SpriteAtlasManager, spriteAtlasManager } from "@/lib/assets/sprite-atlas-manager";
import type { AnimationAtlasClip, SpriteAtlas } from "@/lib/assets/asset-types";

const clips = {
  lumi_idle: {
    assetId: "character.lumi",
    fps: 8,
    frames: ["default"],
    name: "lumi_idle"
  },
  lumi_emotion_overlay: {
    assetId: "character.lumi",
    fps: 10,
    frames: ["default"],
    name: "lumi_emotion_overlay"
  },
  meadow_keeper_idle: {
    assetId: "character.npc_meadow_keeper",
    fps: 6,
    frames: ["default"],
    name: "meadow_keeper_idle"
  },
  player_walk: {
    assetId: "character.player",
    fps: 10,
    frames: ["default"],
    name: "player_walk"
  }
} satisfies Record<string, AnimationAtlasClip>;

export type AnimationClipId = keyof typeof clips;

/** Loads animation clip metadata while placeholders use a one-frame atlas. */
export class AnimationAtlasLoader {
  constructor(private readonly atlases: SpriteAtlasManager = spriteAtlasManager) {}

  getClip(id: AnimationClipId): AnimationAtlasClip {
    return clips[id];
  }

  load(id: AnimationClipId): { atlas: SpriteAtlas; clip: AnimationAtlasClip } {
    const clip = this.getClip(id);
    return {
      atlas: this.atlases.getAtlas(clip.assetId),
      clip
    };
  }
}

export const animationAtlasLoader = new AnimationAtlasLoader();
