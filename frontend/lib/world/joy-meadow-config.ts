export type TimeOfDay = "morning" | "afternoon" | "golden_hour" | "night";
export type ParticleKind =
  "wind" | "flowers" | "sparkles" | "magic" | "fireflies" | "recipe" | "restoration" | "leaves";

type LightingPreset = {
  ambientColor: string;
  ambientIntensity: number;
  background: string;
  exposure: number;
  fog: string;
  keyColor: string;
  keyIntensity: number;
  keyPosition: [number, number, number];
  skyGlow: string;
};

type ParticlePreset = {
  color: string;
  opacity: number;
  size: number;
  speed: number;
};

export const joyMeadowPalette = {
  bark: "#76543c",
  berry: "#c54f73",
  bridge: "#a9784e",
  cloud: "#fff7e8",
  cottage: "#fff0c2",
  cottageRoof: "#e98586",
  flowerGold: "#ffd45c",
  flowerPink: "#f38ca7",
  flowerWhite: "#fff8da",
  grass: "#68ad65",
  grassDark: "#3f8755",
  hill: "#75b96e",
  hillFar: "#85c887",
  iceCreamMint: "#87d8bb",
  iceCreamPink: "#f2a2bb",
  iceCreamVanilla: "#ffe5a4",
  leaf: "#4d965b",
  leafLight: "#79bd68",
  recipeGlow: "#ffd96a",
  river: "#65c5cf",
  riverHighlight: "#d8ffff",
  shrine: "#f4dcaa",
  windmill: "#f7dca2"
} as const;

export const lightingPresets: Record<TimeOfDay, LightingPreset> = {
  morning: {
    ambientColor: "#fff0c7",
    ambientIntensity: 1.4,
    background: "#a9dcec",
    exposure: 1.05,
    fog: "#c5e8e7",
    keyColor: "#ffe5a3",
    keyIntensity: 2,
    keyPosition: [-5, 8, 3],
    skyGlow: "#fff3be"
  },
  afternoon: {
    ambientColor: "#e8f6d2",
    ambientIntensity: 1.55,
    background: "#83cce2",
    exposure: 1.1,
    fog: "#b8ded2",
    keyColor: "#fff2bd",
    keyIntensity: 2.25,
    keyPosition: [4, 9, 2],
    skyGlow: "#fff5c8"
  },
  golden_hour: {
    ambientColor: "#ffd7ae",
    ambientIntensity: 1.3,
    background: "#eea57f",
    exposure: 1.08,
    fog: "#eab78f",
    keyColor: "#ffc36f",
    keyIntensity: 2.4,
    keyPosition: [7, 5, -2],
    skyGlow: "#ffd27d"
  },
  night: {
    ambientColor: "#809ac5",
    ambientIntensity: 0.75,
    background: "#172b4d",
    exposure: 0.82,
    fog: "#213c5a",
    keyColor: "#b7d8ff",
    keyIntensity: 1.15,
    keyPosition: [-4, 7, -1],
    skyGlow: "#d6e7ff"
  }
};

export const particlePresets: Record<ParticleKind, ParticlePreset> = {
  wind: { color: "#fff4c2", opacity: 0.38, size: 0.035, speed: 0.35 },
  flowers: { color: "#f38ca7", opacity: 0.7, size: 0.055, speed: 0.22 },
  sparkles: { color: "#ffe784", opacity: 0.9, size: 0.07, speed: 0.4 },
  magic: { color: "#a9f1d4", opacity: 0.85, size: 0.075, speed: 0.3 },
  fireflies: { color: "#fff28b", opacity: 0.95, size: 0.09, speed: 0.24 },
  recipe: { color: "#ffd96a", opacity: 0.9, size: 0.085, speed: 0.5 },
  restoration: { color: "#fff4ae", opacity: 0.95, size: 0.1, speed: 0.58 },
  leaves: { color: "#78ad62", opacity: 0.72, size: 0.065, speed: 0.3 }
};

export const environmentMotion = {
  beeBobSpeed: 1.7,
  beeOrbitSpeed: 0.8,
  birdBobFactor: 2,
  butterflySpeed: 0.55,
  butterflyRotationSpeed: 0.2,
  butterflyVerticalFactor: 1.8,
  birdSpeed: 0.24,
  cameraFloatAmplitude: 0.08,
  cameraFloatSpeed: 0.28,
  cameraLerp: 0.035,
  cloudSpeed: 0.16,
  flowerSwayFactor: 0.8,
  grassSwayAmplitude: 0.018,
  grassSwaySpeed: 1.15,
  journalTreeSwaySpeed: 0.42,
  parallaxLerp: 0.025,
  parallaxStrength: 0.35,
  particlePulseSpeed: 2.2,
  particleRotationFactor: 0.025,
  particleVerticalFactor: 1.7,
  treeSwaySpeed: 0.45,
  waterBobAmplitude: 0.025,
  waterHighlightSpeed: 0.35,
  waterOpacitySpeed: 0.8,
  waterSpeed: 0.7,
  windmillSpeed: 0.42,
  zoomMax: 12.5,
  zoomMin: 8.5,
  zoomSensitivity: 0.002
} as const;

export const environmentCounts = {
  bees: 3,
  birds: 3,
  butterflies: 5,
  clouds: 7,
  fireflies: 54,
  flowers: 72,
  flowerParticles: 30,
  grass: 220,
  leaves: 24,
  magicParticles: 20,
  pollen: 76,
  recipeParticles: 32,
  sparkles: 24,
  restorationParticles: 44
} as const;

export const environmentTiming = {
  clockRefreshMs: 60_000
} as const;

export const joyMeadowLandmarks = [
  { id: "windmill", position: [-4.2, 0, -3.4] },
  { id: "small_bridge", position: [1.5, 0.25, -0.2] },
  { id: "ice_cream_tree", position: [-5, 0, -6.1] },
  { id: "meadow_keeper_house", position: [4.4, 0, -4.3] },
  { id: "recipe_shrine", position: [4.2, 0, 1.5] },
  { id: "journal_tree", position: [-4.7, 0, 2.1] }
] as const;

export const joyMeadowTreePositions = [
  [-6.2, 0, -2.8],
  [-5.7, 0, 0.2],
  [-3, 0, -6.8],
  [2.9, 0, -7],
  [5.9, 0, -6],
  [6.2, 0, -1],
  [5.7, 0, 3.2],
  [-6.1, 0, 4]
] as const;

export const joyMeadowBushPositions = [
  [-2.8, 0, -1],
  [-2.2, 0, 2.5],
  [3.3, 0, -2],
  [5.4, 0, 0.8],
  [-4, 0, 4]
] as const;

export function resolveTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 11) {
    return "morning";
  }
  if (hour >= 11 && hour < 17) {
    return "afternoon";
  }
  if (hour >= 17 && hour < 20) {
    return "golden_hour";
  }
  return "night";
}
