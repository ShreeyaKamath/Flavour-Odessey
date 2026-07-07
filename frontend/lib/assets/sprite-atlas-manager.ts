import { AssetCache } from "@/lib/assets/asset-cache";
import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { SpriteAtlas, SpriteFrame } from "@/lib/assets/asset-types";

function defaultFrame(assetId: string): SpriteFrame {
  return {
    assetId,
    height: 1,
    name: "default",
    width: 1,
    x: 0,
    y: 0
  };
}

/** Builds minimal atlases now and leaves room for packed production sprite sheets later. */
export class SpriteAtlasManager {
  private readonly cache = new AssetCache<SpriteAtlas>();

  constructor(private readonly assets: AssetManager = assetManager) {}

  getAtlas(assetId: string): SpriteAtlas {
    const cached = this.cache.get(assetId);
    if (cached) {
      return cached;
    }

    const resolution = this.assets.resolve(assetId);
    return this.cache.set(assetId, {
      assetId: resolution.entry.id,
      frames: [defaultFrame(resolution.entry.id)],
      imageUrl: resolution.url
    });
  }

  getFrame(assetId: string, frameName = "default"): SpriteFrame {
    const atlas = this.getAtlas(assetId);
    return atlas.frames.find((frame) => frame.name === frameName) ?? atlas.frames[0];
  }
}

export const spriteAtlasManager = new SpriteAtlasManager();
