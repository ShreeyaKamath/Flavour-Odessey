import type { VisualBinding, VisualElementId } from "@/lib/rendering/rendering-types";

export const visualBindings = {
  berry_bush: {
    assetId: "environment.berry_bush",
    id: "berry_bush",
    layer: "environment",
    preload: false
  },
  bookmark: {
    assetId: "icon.bookmark",
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
    assetId: "ui.fantasy_border",
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
  dust: {
    assetId: "effect.dust",
    id: "dust",
    layer: "effect",
    preload: false
  },
  fantasy_border: {
    assetId: "ui.fantasy_border",
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
  npc_house: {
    assetId: "environment.npc_house",
    id: "npc_house",
    layer: "environment",
    preload: true
  },
  parchment_panel: {
    assetId: "ui.parchment_texture",
    id: "parchment_panel",
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
