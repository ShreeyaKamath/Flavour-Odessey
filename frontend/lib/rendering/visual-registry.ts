import type { VisualBinding, VisualElementId } from "@/lib/rendering/rendering-types";

export const visualBindings = {
  berry_bush: {
    assetId: "environment.berry_bush",
    id: "berry_bush",
    layer: "environment",
    preload: false
  },
  bookmark: {
    assetId: "ui.bookmark_texture",
    id: "bookmark",
    layer: "ui",
    preload: true
  },
  bridge: {
    assetId: "environment.bridge",
    id: "bridge",
    layer: "environment",
    preload: true
  },
  button_border: {
    assetId: "ui.gold_border",
    id: "button_border",
    layer: "ui",
    preload: true
  },
  cloud: {
    assetId: "environment.cloud",
    id: "cloud",
    layer: "background",
    preload: true
  },
  crystal_panel: {
    assetId: "ui.crystal_texture",
    id: "crystal_panel",
    layer: "ui",
    preload: true
  },
  crystal_texture: {
    assetId: "ui.crystal_texture",
    id: "crystal_texture",
    layer: "ui",
    preload: true
  },
  dust: {
    assetId: "effect.dust",
    id: "dust",
    layer: "effect",
    preload: false
  },
  fantasy_border: {
    assetId: "ui.gold_border",
    id: "fantasy_border",
    layer: "ui",
    preload: true
  },
  firefly: {
    assetId: "effect.firefly",
    id: "firefly",
    layer: "effect",
    preload: false
  },
  flower: {
    assetId: "environment.flower",
    id: "flower",
    layer: "environment",
    preload: false
  },
  glow: {
    assetId: "effect.glow",
    id: "glow",
    layer: "effect",
    preload: true
  },
  gold_border: {
    assetId: "ui.gold_border",
    id: "gold_border",
    layer: "ui",
    preload: true
  },
  golden_vanilla_bloom: {
    assetId: "ice_cream.golden_vanilla_bloom",
    id: "golden_vanilla_bloom",
    layer: "ice_cream",
    preload: true
  },
  grass: {
    assetId: "environment.grass",
    id: "grass",
    layer: "environment",
    preload: false
  },
  ink_sparkle: {
    assetId: "ui.ink_sparkle",
    id: "ink_sparkle",
    layer: "ui",
    preload: false
  },
  journal_tree: {
    assetId: "environment.journal_tree",
    id: "journal_tree",
    layer: "environment",
    preload: true
  },
  lumi: {
    assetId: "character.lumi",
    id: "lumi",
    layer: "character",
    preload: true
  },
  lumi_celebrating: {
    assetId: "character.lumi_celebrating",
    id: "lumi_celebrating",
    layer: "character",
    preload: true
  },
  lumi_curious: {
    assetId: "character.lumi_curious",
    id: "lumi_curious",
    layer: "character",
    preload: true
  },
  lumi_excited: {
    assetId: "character.lumi_excited",
    id: "lumi_excited",
    layer: "character",
    preload: true
  },
  lumi_glow: {
    assetId: "character.lumi_glow",
    id: "lumi_glow",
    layer: "effect",
    preload: true
  },
  lumi_happy: {
    assetId: "character.lumi_happy",
    id: "lumi_happy",
    layer: "character",
    preload: true
  },
  lumi_idle: {
    assetId: "character.lumi_idle",
    id: "lumi_idle",
    layer: "character",
    preload: true
  },
  lumi_sleepy: {
    assetId: "character.lumi_sleepy",
    id: "lumi_sleepy",
    layer: "character",
    preload: true
  },
  lumi_trail: {
    assetId: "character.lumi_trail",
    id: "lumi_trail",
    layer: "effect",
    preload: true
  },
  lumi_worried: {
    assetId: "character.lumi_worried",
    id: "lumi_worried",
    layer: "character",
    preload: true
  },
  meadow_background: {
    assetId: "environment.meadow_background",
    id: "meadow_background",
    layer: "background",
    preload: true
  },
  meadow_keeper: {
    assetId: "character.npc_meadow_keeper",
    id: "meadow_keeper",
    layer: "character",
    preload: true
  },
  mist: {
    assetId: "effect.mist",
    id: "mist",
    layer: "effect",
    preload: false
  },
  npc_baker: {
    assetId: "character.npc_baker",
    id: "npc_baker",
    layer: "character",
    preload: true
  },
  npc_baker_idle: {
    assetId: "character.npc_baker_idle",
    id: "npc_baker_idle",
    layer: "character",
    preload: false
  },
  npc_baker_portrait: {
    assetId: "portrait.npc_baker",
    id: "npc_baker_portrait",
    layer: "character",
    preload: true
  },
  npc_baker_walk: {
    assetId: "character.npc_baker_walk",
    id: "npc_baker_walk",
    layer: "character",
    preload: false
  },
  npc_child_explorer: {
    assetId: "character.npc_child_explorer",
    id: "npc_child_explorer",
    layer: "character",
    preload: true
  },
  npc_child_explorer_idle: {
    assetId: "character.npc_child_explorer_idle",
    id: "npc_child_explorer_idle",
    layer: "character",
    preload: false
  },
  npc_child_explorer_portrait: {
    assetId: "portrait.npc_child_explorer",
    id: "npc_child_explorer_portrait",
    layer: "character",
    preload: true
  },
  npc_child_explorer_walk: {
    assetId: "character.npc_child_explorer_walk",
    id: "npc_child_explorer_walk",
    layer: "character",
    preload: false
  },
  npc_gardener: {
    assetId: "character.npc_gardener",
    id: "npc_gardener",
    layer: "character",
    preload: true
  },
  npc_gardener_idle: {
    assetId: "character.npc_gardener_idle",
    id: "npc_gardener_idle",
    layer: "character",
    preload: false
  },
  npc_gardener_portrait: {
    assetId: "portrait.npc_gardener",
    id: "npc_gardener_portrait",
    layer: "character",
    preload: true
  },
  npc_gardener_walk: {
    assetId: "character.npc_gardener_walk",
    id: "npc_gardener_walk",
    layer: "character",
    preload: false
  },
  npc_house: {
    assetId: "environment.npc_house",
    id: "npc_house",
    layer: "environment",
    preload: true
  },
  npc_meadow_keeper_idle: {
    assetId: "character.npc_meadow_keeper_idle",
    id: "npc_meadow_keeper_idle",
    layer: "character",
    preload: false
  },
  npc_meadow_keeper_portrait: {
    assetId: "portrait.npc_meadow_keeper",
    id: "npc_meadow_keeper_portrait",
    layer: "character",
    preload: true
  },
  npc_meadow_keeper_walk: {
    assetId: "character.npc_meadow_keeper_walk",
    id: "npc_meadow_keeper_walk",
    layer: "character",
    preload: false
  },
  npc_traveling_merchant: {
    assetId: "character.npc_traveling_merchant",
    id: "npc_traveling_merchant",
    layer: "character",
    preload: true
  },
  npc_traveling_merchant_idle: {
    assetId: "character.npc_traveling_merchant_idle",
    id: "npc_traveling_merchant_idle",
    layer: "character",
    preload: false
  },
  npc_traveling_merchant_portrait: {
    assetId: "portrait.npc_traveling_merchant",
    id: "npc_traveling_merchant_portrait",
    layer: "character",
    preload: true
  },
  npc_traveling_merchant_walk: {
    assetId: "character.npc_traveling_merchant_walk",
    id: "npc_traveling_merchant_walk",
    layer: "character",
    preload: false
  },
  page_edge: {
    assetId: "ui.page_edge",
    id: "page_edge",
    layer: "ui",
    preload: true
  },
  parchment_panel: {
    assetId: "ui.parchment_texture",
    id: "parchment_panel",
    layer: "ui",
    preload: true
  },
  parchment_texture: {
    assetId: "ui.parchment_texture",
    id: "parchment_texture",
    layer: "ui",
    preload: true
  },
  path: {
    assetId: "environment.path",
    id: "path",
    layer: "environment",
    preload: false
  },
  player: {
    assetId: "character.player",
    id: "player",
    layer: "character",
    preload: true
  },
  rain: {
    assetId: "effect.rain",
    id: "rain",
    layer: "effect",
    preload: false
  },
  recipe_shrine: {
    assetId: "environment.recipe_shrine",
    id: "recipe_shrine",
    layer: "environment",
    preload: true
  },
  ribbon: {
    assetId: "ui.ribbon_texture",
    id: "ribbon",
    layer: "ui",
    preload: true
  },
  ribbon_texture: {
    assetId: "ui.ribbon_texture",
    id: "ribbon_texture",
    layer: "ui",
    preload: true
  },
  river: {
    assetId: "environment.river",
    id: "river",
    layer: "environment",
    preload: true
  },
  rock: {
    assetId: "environment.rock",
    id: "rock",
    layer: "environment",
    preload: false
  },
  satchel_icon: {
    assetId: "icon.satchel",
    id: "satchel_icon",
    layer: "ui",
    preload: true
  },
  snow: {
    assetId: "effect.snow",
    id: "snow",
    layer: "effect",
    preload: false
  },
  sparkle: {
    assetId: "effect.sparkle",
    id: "sparkle",
    layer: "effect",
    preload: true
  },
  steam: {
    assetId: "effect.steam",
    id: "steam",
    layer: "effect",
    preload: false
  },
  sky: {
    assetId: "environment.sky",
    id: "sky",
    layer: "background",
    preload: true
  },
  tree: {
    assetId: "environment.tree",
    id: "tree",
    layer: "environment",
    preload: false
  },
  water: {
    assetId: "environment.water",
    id: "water",
    layer: "environment",
    preload: true
  },
  water_ripple: {
    assetId: "effect.water_ripple",
    id: "water_ripple",
    layer: "effect",
    preload: false
  },
  windmill: {
    assetId: "environment.windmill",
    id: "windmill",
    layer: "environment",
    preload: true
  },
  wood_panel: {
    assetId: "ui.wood_texture",
    id: "wood_panel",
    layer: "ui",
    preload: true
  }
} satisfies Record<VisualElementId, VisualBinding>;

/** Returns the production-art binding for a semantic visual element. */
export function getVisualBinding(id: VisualElementId): VisualBinding {
  return visualBindings[id];
}

export function preloadVisualAssetIds(): string[] {
  return Object.values(visualBindings)
    .filter((binding) => binding.preload)
    .map((binding) => binding.assetId);
}
