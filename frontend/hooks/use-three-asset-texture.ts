"use client";

import { useEffect, useMemo, useState } from "react";
import { SRGBColorSpace, Texture, TextureLoader } from "three";

import { assetManager } from "@/lib/assets/asset-manager";
import type { AssetLodTier, AssetResolution } from "@/lib/assets/asset-types";

type ThreeAssetTexture = {
  resolution: AssetResolution | null;
  texture: Texture | null;
};

/** Loads a manifest image as a Three.js texture and leaves callers on procedural fallback on failure. */
export function useThreeAssetTexture(
  assetId: string,
  lod: AssetLodTier = "near"
): ThreeAssetTexture {
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
