import { AssetCache } from "@/lib/assets/asset-cache";
import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { PreloadResult } from "@/lib/assets/asset-types";

type ImageHandle = {
  assetId: string;
  element?: HTMLImageElement;
  placeholder: boolean;
  url: string;
};

/** Preloads image-compatible assets and keeps placeholder-only assets cheap. */
export class AssetPreloader {
  private readonly cache = new AssetCache<ImageHandle>();

  constructor(private readonly assets: AssetManager = assetManager) {}

  clear(): void {
    this.cache.clear();
  }

  preload(assetIds: string[]): Promise<PreloadResult[]> {
    return Promise.all(assetIds.map((assetId) => this.preloadOne(assetId)));
  }

  preloadOne(assetId: string): Promise<PreloadResult> {
    const cached = this.cache.get(assetId);
    if (cached) {
      return Promise.resolve({
        assetId,
        fromCache: true,
        placeholder: cached.placeholder,
        url: cached.url
      });
    }

    const resolution = this.assets.resolve(assetId);
    if (resolution.placeholder || typeof Image === "undefined") {
      this.cache.set(assetId, {
        assetId,
        placeholder: resolution.placeholder,
        url: resolution.url
      });
      return Promise.resolve({
        assetId,
        fromCache: false,
        placeholder: resolution.placeholder,
        url: resolution.url
      });
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.cache.set(assetId, {
          assetId,
          element: image,
          placeholder: false,
          url: resolution.url
        });
        resolve({
          assetId,
          fromCache: false,
          placeholder: false,
          url: resolution.url
        });
      };
      image.onerror = () => reject(new Error(`Unable to preload asset: ${assetId}`));
      image.src = resolution.url;
    });
  }
}

export const assetPreloader = new AssetPreloader();
