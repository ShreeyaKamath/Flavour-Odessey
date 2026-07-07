import { AssetManager, assetManager } from "@/lib/assets/asset-manager";

export type ImageFormat = "avif" | "png" | "webp";

export type ImageOptimizationProfile = {
  decoding: "async";
  formats: ImageFormat[];
  loading: "eager" | "lazy";
  sizes: string;
  widths: number[];
};

export type OptimizedImageCandidate = {
  assetId: string;
  format: ImageFormat;
  placeholder: boolean;
  src: string;
  width: number;
};

export const defaultImageOptimizationProfile: ImageOptimizationProfile = {
  decoding: "async",
  formats: ["webp", "avif", "png"],
  loading: "lazy",
  sizes: "(max-width: 768px) 100vw, 50vw",
  widths: [320, 640, 960, 1280]
};

/** Produces image candidate metadata for future CDN/Next Image replacement. */
export function createImageOptimizationPlan(
  assetId: string,
  {
    assets = assetManager,
    profile = defaultImageOptimizationProfile
  }: {
    assets?: AssetManager;
    profile?: ImageOptimizationProfile;
  } = {}
): OptimizedImageCandidate[] {
  const resolution = assets.resolve(assetId);
  return profile.widths.flatMap((width) =>
    profile.formats.map((format) => ({
      assetId: resolution.entry.id,
      format,
      placeholder: resolution.placeholder,
      src: resolution.url,
      width
    }))
  );
}
