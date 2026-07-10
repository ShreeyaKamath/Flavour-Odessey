import type { MaterialDescriptor } from "@/lib/assets/asset-types";

const materials = {
  berry_bush_leaf: {
    assetId: "environment.berry_bush",
    color: "#4d965b",
    metalness: 0,
    name: "Berry Bush Leaf",
    opacity: 1,
    roughness: 0.74,
    textureId: "environment.berry_bush"
  },
  golden_vanilla_bloom: {
    assetId: "ice_cream.golden_vanilla_bloom",
    bloomLayer: true,
    color: "#ffe5a4",
    emissive: "#ffd96a",
    metalness: 0.04,
    name: "Golden Vanilla Bloom",
    opacity: 1,
    roughness: 0.48,
    textureId: "ice_cream.golden_vanilla_bloom"
  },
  ice_cream_chocolate_drizzle: {
    assetId: "ice_cream.chocolate_drizzle",
    color: "#76543c",
    metalness: 0.02,
    name: "Chocolate Drizzle",
    opacity: 1,
    roughness: 0.34,
    textureId: "ice_cream.chocolate_drizzle"
  },
  ice_cream_drizzle: {
    assetId: "ice_cream.drizzle",
    color: "#76543c",
    metalness: 0.02,
    name: "Drizzle",
    opacity: 1,
    roughness: 0.34,
    textureId: "ice_cream.drizzle"
  },
  ice_cream_fruit: {
    assetId: "ice_cream.fruit",
    color: "#c54f73",
    metalness: 0,
    name: "Fruit Topping",
    opacity: 1,
    roughness: 0.5,
    textureId: "ice_cream.fruit"
  },
  ice_cream_reflection: {
    assetId: "effect.reflection",
    bloomLayer: true,
    color: "#d8ffff",
    metalness: 0.12,
    name: "Ice Cream Reflection",
    opacity: 0.58,
    roughness: 0.12,
    textureId: "effect.reflection"
  },
  ice_cream_soft_shadow: {
    assetId: "effect.soft_shadow",
    color: "#76543c",
    metalness: 0,
    name: "Ice Cream Soft Shadow",
    opacity: 0.32,
    roughness: 0.92,
    textureId: "effect.soft_shadow"
  },
  ice_cream_sprinkles: {
    assetId: "ice_cream.sprinkles",
    color: "#ffd45c",
    metalness: 0,
    name: "Sprinkles",
    opacity: 1,
    roughness: 0.62,
    textureId: "ice_cream.sprinkles"
  },
  ice_cream_scoop_base: {
    assetId: "ice_cream.scoop_base",
    bloomLayer: true,
    color: "#ffd878",
    emissive: "#f4ae42",
    metalness: 0.04,
    name: "Scoop Base",
    opacity: 1,
    roughness: 0.48,
    textureId: "ice_cream.scoop_base"
  },
  ice_cream_steam: {
    assetId: "effect.steam",
    bloomLayer: true,
    color: "#fff8da",
    metalness: 0,
    name: "Ice Cream Steam",
    opacity: 0.42,
    roughness: 0.18,
    textureId: "effect.steam"
  },
  joy_meadow_water: {
    assetId: "environment.water",
    bloomLayer: true,
    color: "#65c5cf",
    metalness: 0.08,
    name: "Joy Meadow Water",
    opacity: 0.86,
    roughness: 0.18,
    textureId: "environment.water"
  },
  magic_glow: {
    assetId: "effect.glow",
    bloomLayer: true,
    color: "#ffd96a",
    emissive: "#fff4ae",
    metalness: 0,
    name: "Magic Glow",
    opacity: 0.88,
    roughness: 0.2,
    textureId: "effect.glow"
  },
  parchment_ui: {
    assetId: "ui.parchment_texture",
    color: "#f4dcaa",
    metalness: 0,
    name: "Parchment UI",
    opacity: 1,
    roughness: 0.82,
    textureId: "ui.parchment_texture"
  }
} satisfies Record<string, MaterialDescriptor>;

export type MaterialId = keyof typeof materials;

/** Central material presets for future texture and shader upgrades. */
export class MaterialLibrary {
  all(): MaterialDescriptor[] {
    return Object.values(materials);
  }

  get(id: MaterialId): MaterialDescriptor {
    return materials[id];
  }
}

export const materialLibrary = new MaterialLibrary();
