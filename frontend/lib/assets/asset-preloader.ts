import { AssetCache } from "@/lib/assets/asset-cache";
import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { PreloadResult } from "@/lib/assets/asset-types";

type ImageHandle = {
  assetId: string;
  element?: HTMLImageElement;
  placeholder: boolean;
  url: string;
};

const preloadFallbackTimeoutMs = process.env.NODE_ENV === "test" ? 25 : 5000;

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

    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const resolveWithPlaceholder = () => {
        if (settled) {
          return;
        }
        settled = true;
        const fallbackUrl = this.assets.placeholderUrl(assetId);
        this.cache.set(assetId, {
          assetId,
          placeholder: true,
          url: fallbackUrl
        });
        resolve({
          assetId,
          fromCache: false,
          placeholder: true,
          url: fallbackUrl
        });
      };
      const timeout = setTimeout(resolveWithPlaceholder, preloadFallbackTimeoutMs);

      image.onload = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timeout);
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
      image.onerror = () => {
        clearTimeout(timeout);
        resolveWithPlaceholder();
      };
      image.src = resolution.url;
    });
  }
}

export const assetPreloader = new AssetPreloader();
