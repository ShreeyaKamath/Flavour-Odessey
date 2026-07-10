export type AssetCategory =
  | "characters"
  | "effects"
  | "environment"
  | "ice_cream"
  | "icons"
  | "ingredients"
  | "portraits"
  | "ui";

export type AssetKind = "effect" | "icon" | "material" | "portrait" | "sprite" | "texture";

export type AssetLodTier = "near" | "medium" | "far";

export type AssetPlaceholder = {
  label: string;
  primary: string;
  secondary: string;
};

export type AssetManifestEntry = {
  category: AssetCategory;
  id: string;
  kind: AssetKind;
  lod: Record<AssetLodTier, string>;
  placeholder: AssetPlaceholder;
  src: string | null;
  tags: string[];
};

export type AssetPack = {
  description: string;
  id: string;
  label: string;
};

export type AssetManifest = {
  activePackId: string;
  assets: AssetManifestEntry[];
  packs: AssetPack[];
  version: number;
};

export type AssetResolution = {
  entry: AssetManifestEntry;
  placeholder: boolean;
  url: string;
};

export type TextureHandle = {
  assetId: string;
  loadedAt: number;
  placeholder: boolean;
  url: string;
};

export type SpriteFrame = {
  assetId: string;
  height: number;
  name: string;
  width: number;
  x: number;
  y: number;
};

export type SpriteAtlas = {
  assetId: string;
  frames: SpriteFrame[];
  imageUrl: string;
};

export type MaterialDescriptor = {
  alphaTest?: number;
  assetId: string;
  bloomLayer?: boolean;
  color: string;
  emissive?: string;
  metalness: number;
  name: string;
  opacity: number;
  roughness: number;
  textureId?: string;
};

export type ThemeAssetRole =
  "bookmark" | "book" | "border" | "button" | "crystal" | "parchment" | "ribbon" | "tabs" | "wood";

export type ThemeAssetBinding = Record<ThemeAssetRole, string>;

export type AnimationAtlasClip = {
  assetId: string;
  fps: number;
  frames: string[];
  name: string;
};

export type PreloadResult = {
  assetId: string;
  fromCache: boolean;
  placeholder: boolean;
  url: string;
};
