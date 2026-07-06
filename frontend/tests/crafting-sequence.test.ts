import { describe, expect, it } from "vitest";

import type { CraftingIngredientId } from "@/lib/crafting/crafting-config";
import {
  hasAllCraftingIngredients,
  isCraftingCinematic,
  nextCraftingPhase
} from "@/lib/crafting/crafting-sequence";

describe("crafting sequence", () => {
  it("advances through the canonical presentation phases", () => {
    expect(nextCraftingPhase("selecting")).toBe("charging");
    expect(nextCraftingPhase("charging")).toBe("materializing");
    expect(nextCraftingPhase("materializing")).toBe("celebrating");
    expect(nextCraftingPhase("celebrating")).toBe("revealed");
    expect(nextCraftingPhase("revealed")).toBe("returning");
    expect(nextCraftingPhase("returning")).toBe("complete");
    expect(nextCraftingPhase("complete")).toBe("complete");
  });

  it("requires both canonical ingredients without changing inventory", () => {
    const selected = new Set<CraftingIngredientId>(["vanilla_orchid"]);
    expect(hasAllCraftingIngredients(selected)).toBe(false);
    selected.add("honey_bloom");
    expect(hasAllCraftingIngredients(selected)).toBe(true);
  });

  it("keeps selection and completed states outside the cinematic overlay", () => {
    expect(isCraftingCinematic("selecting")).toBe(false);
    expect(isCraftingCinematic("charging")).toBe(true);
    expect(isCraftingCinematic("revealed")).toBe(true);
    expect(isCraftingCinematic("complete")).toBe(false);
  });
});
