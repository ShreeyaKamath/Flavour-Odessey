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
  | "crystal_texture"
  | "dust"
  | "fantasy_border"
  | "firefly"
  | "flower"
  | "glow"
  | "gold_border"
  | "golden_vanilla_bloom"
  | "grass"
  | "ink_sparkle"
  | "journal_tree"
  | "lumi"
  | "lumi_celebrating"
  | "lumi_curious"
  | "lumi_excited"
  | "lumi_glow"
  | "lumi_happy"
  | "lumi_idle"
  | "lumi_sleepy"
  | "lumi_trail"
  | "lumi_worried"
  | "meadow_background"
  | "meadow_keeper"
  | "mist"
  | "npc_baker"
  | "npc_baker_idle"
  | "npc_baker_portrait"
  | "npc_baker_walk"
  | "npc_child_explorer"
  | "npc_child_explorer_idle"
  | "npc_child_explorer_portrait"
  | "npc_child_explorer_walk"
  | "npc_gardener"
  | "npc_gardener_idle"
  | "npc_gardener_portrait"
  | "npc_gardener_walk"
  | "npc_house"
  | "npc_meadow_keeper_idle"
  | "npc_meadow_keeper_portrait"
  | "npc_meadow_keeper_walk"
  | "npc_traveling_merchant"
  | "npc_traveling_merchant_idle"
  | "npc_traveling_merchant_portrait"
  | "npc_traveling_merchant_walk"
  | "page_edge"
  | "parchment_panel"
  | "parchment_texture"
  | "path"
  | "player"
  | "rain"
  | "recipe_shrine"
  | "ribbon"
  | "ribbon_texture"
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
