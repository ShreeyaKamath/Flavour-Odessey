"use client";

import { useEffect, useMemo, useState } from "react";
import { SRGBColorSpace, Texture, TextureLoader } from "three";

import { assetManager } from "@/lib/assets/asset-manager";
import type { AssetLodTier, AssetResolution } from "@/lib/assets/asset-types";

type AssetTextureResult = {
  resolution: AssetResolution | null;
  texture: Texture | null;
};

/** Loads an optional manifest texture and falls back to procedural materials on failure. */
export function useAssetTexture(assetId: string, lod: AssetLodTier = "near"): AssetTextureResult {
  const resolution = useMemo(() => {
    try {
      return assetManager.resolve(assetId, lod);
    } catch {
      return null;
    }
  }, [assetId, lod]);
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    setTexture(null);
    if (!resolution || resolution.placeholder || typeof window === "undefined") {
      return undefined;
    }

    let active = true;
    let loadedTexture: Texture | null = null;
    const loader = new TextureLoader();

    loader.load(
      resolution.url,
      (loaded) => {
        if (!active) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = SRGBColorSpace;
        loadedTexture = loaded;
        setTexture(loaded);
      },
      undefined,
      () => {
        if (active) {
          setTexture(null);
        }
      }
    );

    return () => {
      active = false;
      loadedTexture?.dispose();
    };
  }, [resolution]);

  return { resolution, texture };
}
