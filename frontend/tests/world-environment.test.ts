import { describe, expect, it } from "vitest";

import { resolveTimeOfDay } from "@/lib/world/joy-meadow-config";
import { createSeededRandom, generateFieldPositions } from "@/lib/world/scene-utils";

describe("Joy Meadow environment foundations", () => {
  it("resolves all four lighting phases", () => {
    expect(resolveTimeOfDay(7)).toBe("morning");
    expect(resolveTimeOfDay(13)).toBe("afternoon");
    expect(resolveTimeOfDay(18)).toBe("golden_hour");
    expect(resolveTimeOfDay(23)).toBe("night");
  });

  it("generates deterministic instanced scenery", () => {
    const firstRandom = createSeededRandom(42);
    const secondRandom = createSeededRandom(42);
    expect(firstRandom()).toBe(secondRandom());
    expect(generateFieldPositions(4, 12, 8, 6)).toEqual(generateFieldPositions(4, 12, 8, 6));
  });
});
