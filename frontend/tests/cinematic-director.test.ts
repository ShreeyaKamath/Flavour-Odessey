import { describe, expect, it } from "vitest";

import { CinematicDirector, cinematicScenes } from "@/lib/cinematics";

describe("CinematicDirector", () => {
  it("registers every required Phase 18 cinematic moment", () => {
    const ids = Object.keys(cinematicScenes);

    expect(ids).toEqual(
      expect.arrayContaining([
        "opening",
        "joy_meadow_arrival",
        "lumi_first_meeting",
        "npc_first_introduction",
        "crafting",
        "recipe_reveal",
        "quest_completion",
        "joy_restoration",
        "journal_memory_reveal",
        "day_transition"
      ])
    );
  });

  it("resolves camera, narration, effects, participants, and typewriter subtitles", () => {
    const director = new CinematicDirector();
    const earlyFrame = director.frame("opening", 1);
    const laterFrame = director.frame("opening", 2.6);

    expect(earlyFrame.camera.rail).toBe("storybook_cover");
    expect(earlyFrame.narration?.speaker).toBe("Narrator");
    expect(earlyFrame.subtitle.length).toBeLessThan(earlyFrame.narration?.text.length ?? 0);
    expect(laterFrame.effects.length).toBeGreaterThan(0);
    expect(director.skip("opening").progress).toBe(1);
  });

  it("filters unsafe motion effects when reduced motion is enabled", () => {
    const director = new CinematicDirector();
    const normalFrame = director.frame("joy_restoration", 2.4, false);
    const reducedFrame = director.frame("joy_restoration", 2.4, true);

    expect(normalFrame.effects.some((effect) => effect.kind === "screen_shake")).toBe(true);
    expect(reducedFrame.effects.some((effect) => effect.kind === "screen_shake")).toBe(false);
    expect(reducedFrame.subtitle).toBe(reducedFrame.narration?.text);
  });
});
