import {
  craftingIngredients,
  type CraftingIngredientId,
  type CraftingPhase
} from "@/lib/crafting/crafting-config";

export const craftingPhaseOrder: CraftingPhase[] = [
  "selecting",
  "charging",
  "materializing",
  "celebrating",
  "revealed",
  "returning",
  "complete"
];

/** Returns the next presentation phase without changing gameplay state. */
export function nextCraftingPhase(phase: CraftingPhase): CraftingPhase {
  const index = craftingPhaseOrder.indexOf(phase);
  return craftingPhaseOrder[Math.min(index + 1, craftingPhaseOrder.length - 1)];
}

/** Checks whether every canonical ingredient is locally selected. */
export function hasAllCraftingIngredients(selected: ReadonlySet<CraftingIngredientId>) {
  return craftingIngredients.every((ingredient) => selected.has(ingredient.id));
}

/** Identifies phases that occupy the cinematic crafting overlay. */
export function isCraftingCinematic(phase: CraftingPhase) {
  return !["selecting", "complete"].includes(phase);
}
