import type { AssetLodTier, AssetResolution } from "@/lib/assets/asset-types";

export type VisualLayer =
  "background" | "character" | "effect" | "environment" | "ice_cream" | "ui";

export type VisualElementId =
  | "berry_bush"
  | "bookmark"
  | "bridge"
  | "button_border"
  | "cloud"
  | "crystal_panel"
  | "dust"
  | "fantasy_border"
  | "firefly"
  | "flower"
  | "glow"
  | "golden_vanilla_bloom"
  | "grass"
  | "journal_tree"
  | "lumi"
  | "meadow_background"
  | "meadow_keeper"
  | "mist"
  | "npc_house"
  | "parchment_panel"
  | "path"
  | "player"
  | "rain"
  | "recipe_shrine"
  | "ribbon"
  | "river"
  | "rock"
  | "satchel_icon"
  | "snow"
  | "sparkle"
  | "steam"
  | "sky"
  | "tree"
  | "water"
  | "water_ripple"
  | "windmill"
  | "wood_panel";

export type VisualBinding = {
  assetId: string;
  id: VisualElementId;
  layer: VisualLayer;
  preload: boolean;
};

export type RenderBounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type ViewportBounds = {
  height: number;
  width: number;
};

export type ResolvedVisual = {
  asset: AssetResolution;
  binding: VisualBinding;
  lod: AssetLodTier;
  shouldRender: boolean;
};
