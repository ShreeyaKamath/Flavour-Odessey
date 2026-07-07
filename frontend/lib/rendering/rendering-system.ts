import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import { AssetPreloader, assetPreloader } from "@/lib/assets/asset-preloader";
import { resolveLodTier, type LodPolicy } from "@/lib/rendering/lod";
import { getVisualBinding, preloadVisualAssetIds } from "@/lib/rendering/visual-registry";
import { isInViewport } from "@/lib/rendering/viewport-culling";
import type {
  RenderBounds,
  ResolvedVisual,
  ViewportBounds,
  VisualElementId
} from "@/lib/rendering/rendering-types";

/** Coordinates semantic visual ids, LOD, preloading, and viewport culling. */
export class RenderingSystem {
  constructor(
    private readonly assets: AssetManager = assetManager,
    private readonly preloader: AssetPreloader = assetPreloader
  ) {}

  preloadCoreVisuals(): Promise<Awaited<ReturnType<AssetPreloader["preload"]>>> {
    return this.preloader.preload(preloadVisualAssetIds());
  }

  resolveVisual({
    bounds,
    distance,
    id,
    lodPolicy,
    viewport
  }: {
    bounds?: RenderBounds;
    distance: number;
    id: VisualElementId;
    lodPolicy?: LodPolicy;
    viewport?: ViewportBounds;
  }): ResolvedVisual {
    const binding = getVisualBinding(id);
    const lod = resolveLodTier(distance, lodPolicy);
    return {
      asset: this.assets.resolve(binding.assetId, lod),
      binding,
      lod,
      shouldRender: bounds && viewport ? isInViewport(bounds, viewport, 64) : true
    };
  }
}

export const renderingSystem = new RenderingSystem();
