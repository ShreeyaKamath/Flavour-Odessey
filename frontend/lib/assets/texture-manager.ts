import { AssetCache } from "@/lib/assets/asset-cache";
import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { AssetLodTier, TextureHandle } from "@/lib/assets/asset-types";

/** Caches texture handles without binding rendering code to a specific image source. */
export class TextureManager {
  private readonly cache = new AssetCache<TextureHandle>();

  constructor(private readonly assets: AssetManager = assetManager) {}

  clear(): void {
    this.cache.clear();
  }

  getTexture(assetId: string, lod: AssetLodTier = "near"): TextureHandle {
    const key = `${assetId}:${lod}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const resolution = this.assets.resolve(assetId, lod);
    return this.cache.set(key, {
      assetId: resolution.entry.id,
      loadedAt: Date.now(),
      placeholder: resolution.placeholder,
      url: resolution.url
    });
  }

  release(assetId: string, lod: AssetLodTier = "near"): boolean {
    return this.cache.delete(`${assetId}:${lod}`);
  }

  size(): number {
    return this.cache.size();
  }
}

export const textureManager = new TextureManager();
