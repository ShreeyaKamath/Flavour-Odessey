import { describe, expect, it } from "vitest";

import { assetManager } from "@/lib/assets";
import { audioIds } from "@/lib/audio/manifest";
import { resolveTimeOfDay } from "@/lib/world/joy-meadow-config";
import { createSeededRandom, generateFieldPositions } from "@/lib/world/scene-utils";
import { TimeManager, WeatherManager } from "@/lib/world/weather-system";

describe("Joy Meadow environment foundations", () => {
  it("resolves all four lighting phases", () => {
    expect(resolveTimeOfDay(7)).toBe("morning");
    expect(resolveTimeOfDay(13)).toBe("afternoon");
    expect(resolveTimeOfDay(18)).toBe("golden_hour");
    expect(resolveTimeOfDay(20)).toBe("evening");
    expect(resolveTimeOfDay(23)).toBe("night");
  });

  it("creates continuous time and weather snapshots for Joy Meadow", () => {
    const time = new TimeManager();
    const weather = new WeatherManager();
    const night = new Date(2026, 6, 7, 23, 30);
    const afternoon = new Date(2026, 6, 7, 13, 15);

    expect(time.resolve(night).timeOfDay).toBe("night");
    expect(weather.resolve(night, "night")).toMatchObject({
      audioAmbience: audioIds.weather_night,
      condition: "night",
      fireflyIntensity: 1,
      season: "joy_meadow_spring"
    });
    expect(weather.resolve(afternoon, "afternoon").transitionProgress).toBeGreaterThanOrEqual(0);
    expect(weather.resolve(afternoon, "afternoon").transitionProgress).toBeLessThanOrEqual(1);
  });

  it("generates deterministic instanced scenery", () => {
    const firstRandom = createSeededRandom(42);
    const secondRandom = createSeededRandom(42);
    expect(firstRandom()).toBe(secondRandom());
    expect(generateFieldPositions(4, 12, 8, 6)).toEqual(generateFieldPositions(4, 12, 8, 6));
  });

  it("resolves Joy Meadow visual assets through the manifest", () => {
    const joyMeadowAssets = [
      "environment.sky",
      "environment.meadow_background",
      "environment.cloud",
      "environment.tree",
      "environment.flower",
      "environment.river",
      "environment.bridge",
      "environment.windmill",
      "environment.npc_house",
      "environment.recipe_shrine",
      "environment.journal_tree"
    ];

    expect(joyMeadowAssets.map((assetId) => assetManager.resolve(assetId).url)).toEqual(
      expect.arrayContaining([
        "/assets/environment/joy-meadow/sky.svg",
        "/assets/environment/joy-meadow/meadow-background.svg",
        "/assets/environment/joy-meadow/windmill.svg"
      ])
    );
  });
});
