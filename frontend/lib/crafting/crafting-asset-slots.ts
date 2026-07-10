import type { CraftingIngredientId } from "@/lib/crafting/crafting-config";

export const craftingAssetSlots = {
  drizzle: "ice_cream.drizzle",
  recipe: "ice_cream.golden_vanilla_bloom",
  recipeCard: "ui.recipe_card",
  scoopBase: "ice_cream.scoop_base",
  sprinkles: "ice_cream.sprinkles"
} as const;

export const craftingIngredientAssetSlots = {
  honey_bloom: "ingredient.honey_bloom",
  vanilla_orchid: "ingredient.vanilla_orchid"
} satisfies Record<CraftingIngredientId, string>;
