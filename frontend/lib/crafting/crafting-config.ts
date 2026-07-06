export type CraftingPhase =
  | "selecting"
  | "charging"
  | "materializing"
  | "celebrating"
  | "revealed"
  | "returning"
  | "complete";

export const craftingIngredients = [
  {
    id: "vanilla_orchid",
    name: "Vanilla Orchid",
    note: "A soft bloom carrying the meadow's first light."
  },
  {
    id: "honey_bloom",
    name: "Honey Bloom",
    note: "Golden nectar with a warm, cheerful sweetness."
  }
] as const;

export type CraftingIngredientId = (typeof craftingIngredients)[number]["id"];

export const craftingTiming = {
  chargeMs: 1800,
  celebrateMs: 1350,
  materializeMs: 1650,
  returnMs: 850
} as const;

export const craftingMotion = {
  autoRotateSpeed: 0.22,
  breathingAmount: 0.035,
  breathingSpeed: 1.45,
  cameraLerp: 0.045,
  cameraOrbitRadius: 0.35,
  cameraOrbitSpeed: 0.55,
  confettiSpeed: 0.42,
  confettiSpeedStep: 0.04,
  dustSpeed: 0.18,
  ingredientFloatAmount: 0.22,
  ingredientFloatSpeed: 1.4,
  ingredientOrbitRadius: 1.7,
  ingredientOrbitSpeed: 0.7,
  lumiOrbitRadius: 2.15,
  lumiOrbitSpeed: 1.1,
  lumiClapSpeedMultiplier: 2.2,
  modelDragSensitivity: 0.008,
  modelRotationLerp: 0.08,
  particlePulseSpeed: 2.4,
  ribbonRotationSpeed: 0.34,
  runeRotationSpeed: 0.24,
  zoomMax: 8.1,
  zoomMin: 4.5,
  zoomSensitivity: 0.0025
} as const;

export const craftingCameraFrames: Record<
  CraftingPhase,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  celebrating: { position: [0, 1.5, 5.6], target: [0, 0.95, 0] },
  charging: { position: [0, 2.5, 7.4], target: [0, 0.7, 0] },
  complete: { position: [0, 1.35, 5.8], target: [0, 0.9, 0] },
  materializing: { position: [0, 1.7, 5.2], target: [0, 0.9, 0] },
  revealed: { position: [0, 1.4, 5.9], target: [0, 0.9, 0] },
  returning: { position: [0, 2.5, 7.4], target: [0, 0.7, 0] },
  selecting: { position: [0, 2.5, 7.4], target: [0, 0.7, 0] }
};

export const craftingPalette = {
  backdrop: "#17131f",
  bowl: "#f4d7a5",
  bowlShadow: "#8d5e46",
  cone: "#c98745",
  coneShadow: "#8f572f",
  confetti: ["#ffd86b", "#79d7b2", "#f49a9a"] as const,
  dust: "#fff1ba",
  fog: "#2c2138",
  goldenLight: "#ffd86b",
  honey: "#f2b84b",
  lumi: "#fff4a8",
  lumiWing: "#d9fff4",
  magic: "#8be2c7",
  orchid: "#f3c6ea",
  ribbon: "#ffca7a",
  rune: "#a8ead7",
  scoop: "#ffd878",
  scoopGlow: "#f4ae42",
  shadow: "#33253b",
  vanilla: "#fff1d4"
} as const;

export const craftingCounts = {
  confetti: 72,
  dust: 64,
  recipeSparkles: 38,
  ribbonSegments: 3,
  runes: 12
} as const;

export const craftingStatus: Record<CraftingPhase, string> = {
  celebrating: "Lumi is celebrating",
  charging: "Ingredients are orbiting",
  complete: "Golden Vanilla Bloom is ready",
  materializing: "Golden light is gathering",
  revealed: "The recipe book has opened",
  returning: "Returning to Joy Meadow",
  selecting: "Choose both meadow ingredients"
};
