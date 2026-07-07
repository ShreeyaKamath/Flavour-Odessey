import type { AssetLodTier } from "@/lib/assets/asset-types";

export type LodPolicy = {
  farDistance: number;
  mediumDistance: number;
};

export const defaultLodPolicy: LodPolicy = {
  farDistance: 32,
  mediumDistance: 14
};

/** Chooses an asset LOD tier from camera/object distance. */
export function resolveLodTier(
  distance: number,
  policy: LodPolicy = defaultLodPolicy
): AssetLodTier {
  if (distance >= policy.farDistance) {
    return "far";
  }
  if (distance >= policy.mediumDistance) {
    return "medium";
  }
  return "near";
}
