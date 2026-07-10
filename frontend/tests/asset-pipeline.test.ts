import { describe, expect, it } from "vitest";

import {
  AnimationAtlasLoader,
  AssetManager,
  AssetPreloader,
  MaterialLibrary,
  SpriteAtlasManager,
  TextureManager,
  ThemeManager,
  assetManifestManager
} from "@/lib/assets";
import { createImageOptimizationPlan } from "@/lib/assets/image-optimization";
import {
  RenderingSystem,
  isInViewport,
  preloadVisualAssetIds,
  resolveLodTier
} from "@/lib/rendering";

describe("production art asset pipeline", () => {
  it("registers replaceable manifest slots for environment, characters, UI, effects, and recipes", () => {
    const ids = assetManifestManager.all().map((entry) => entry.id);

    expect(ids).toEqual(expect.arrayContaining(["environment.windmill"]));
    expect(ids).toEqual(expect.arrayContaining(["environment.recipe_shrine"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_idle"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_happy"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_curious"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_excited"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_sleepy"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_worried"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_celebrating"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_glow"]));
    expect(ids).toEqual(expect.arrayContaining(["character.lumi_trail"]));
    expect(ids).toEqual(expect.arrayContaining(["portrait.npc_meadow_keeper"]));
    expect(ids).toEqual(expect.arrayContaining(["portrait.npc_baker"]));
    expect(ids).toEqual(expect.arrayContaining(["portrait.npc_gardener"]));
    expect(ids).toEqual(expect.arrayContaining(["portrait.npc_child_explorer"]));
    expect(ids).toEqual(expect.arrayContaining(["portrait.npc_traveling_merchant"]));
    expect(ids).toEqual(expect.arrayContaining(["character.npc_baker_idle"]));
    expect(ids).toEqual(expect.arrayContaining(["character.npc_baker_walk"]));
    expect(ids).toEqual(expect.arrayContaining(["character.player"]));
    expect(ids).toEqual(expect.arrayContaining(["ingredient.vanilla_orchid"]));
    expect(ids).toEqual(expect.arrayContaining(["ingredient.honey_bloom"]));
    expect(ids).toEqual(expect.arrayContaining(["ice_cream.golden_vanilla_bloom"]));
    expect(ids).toEqual(expect.arrayContaining(["ice_cream.scoop_base"]));
    expect(ids).toEqual(expect.arrayContaining(["ice_cream.sprinkles"]));
    expect(ids).toEqual(expect.arrayContaining(["ice_cream.drizzle"]));
    expect(ids).toEqual(expect.arrayContaining(["ice_cream.chocolate_drizzle"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.recipe_card"]));
    expect(ids).toEqual(expect.arrayContaining(["effect.snow"]));
    expect(ids).toEqual(expect.arrayContaining(["effect.steam"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.parchment_texture"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.page_edge"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.ribbon_texture"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.bookmark_texture"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.crystal_texture"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.wood_texture"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.gold_border"]));
    expect(ids).toEqual(expect.arrayContaining(["ui.ink_sparkle"]));
    expect(ids).toEqual(expect.arrayContaining(["effect.water_ripple"]));
  });

  it("resolves replaceable local assets with generated fallback placeholders", () => {
    const assets = new AssetManager();
    const tree = assets.resolve("environment.tree");
    const sky = assets.resolve("environment.sky");
    const parchment = assets.resolve("ui.parchment_texture");

    expect(assets.resolve("character.lumi_excited").url).toBe(
      "/assets/characters/lumi/lumi-excited.svg"
    );
    expect(assets.resolve("portrait.npc_meadow_keeper").url).toBe(
      "/assets/characters/npcs/meadow-keeper-portrait.svg"
    );
    expect(tree.placeholder).toBe(false);
    expect(tree.url).toBe("/assets/environment/joy-meadow/tree.svg");
    expect(sky.url).toBe("/assets/environment/joy-meadow/sky.svg");
    expect(parchment.placeholder).toBe(false);
    expect(parchment.url).toBe("/assets/ui/storybook/parchment-texture.svg");
    expect(assets.placeholderUrl("environment.tree")).toContain("data:image/svg+xml");
    expect(assets.byCategory("environment").length).toBeGreaterThan(10);
  });

  it("caches texture and atlas handles without coupling callers to file paths", () => {
    const textureManager = new TextureManager();
    const firstTexture = textureManager.getTexture("environment.water");
    const secondTexture = textureManager.getTexture("environment.water");
    const atlas = new SpriteAtlasManager().getAtlas("character.lumi");

    expect(firstTexture).toBe(secondTexture);
    expect(textureManager.size()).toBe(1);
    expect(atlas.frames[0]).toMatchObject({ name: "default" });
  });

  it("exposes theme, material, and animation bindings for replaceable art packs", () => {
    const theme = new ThemeManager();
    const materials = new MaterialLibrary();
    const animation = new AnimationAtlasLoader().load("lumi_idle");

    expect(theme.assetId("parchment")).toBe("ui.parchment_texture");
    expect(theme.assetId("pageEdge")).toBe("ui.page_edge");
    expect(theme.cssVars()["--asset-book"]).toContain("/assets/ui/storybook/parchment-texture.svg");
    expect(theme.cssVars()["--storybook-page-edge-texture"]).toContain(
      "/assets/ui/storybook/page-edge-texture.svg"
    );
    expect(materials.get("golden_vanilla_bloom")).toMatchObject({
      assetId: "ice_cream.golden_vanilla_bloom",
      bloomLayer: true
    });
    expect(materials.get("ice_cream_scoop_base")).toMatchObject({
      assetId: "ice_cream.scoop_base",
      bloomLayer: true
    });
    expect(materials.get("ice_cream_drizzle")).toMatchObject({
      assetId: "ice_cream.drizzle"
    });
    expect(materials.get("ice_cream_steam")).toMatchObject({
      assetId: "effect.steam",
      bloomLayer: true
    });
    expect(animation.clip.frames).toEqual(["default"]);
  });

  it("supports image optimization, LOD selection, viewport culling, and core visual preloading", async () => {
    const rendering = new RenderingSystem();
    const preloader = new AssetPreloader();
    const imagePlan = createImageOptimizationPlan("ui.parchment_texture");

    expect(imagePlan).toHaveLength(12);
    expect(imagePlan.every((candidate) => candidate.src.length > 0)).toBe(true);
    expect(imagePlan[0]).toMatchObject({
      placeholder: false,
      src: "/assets/ui/storybook/parchment-texture.svg"
    });
    expect(resolveLodTier(4)).toBe("near");
    expect(resolveLodTier(18)).toBe("medium");
    expect(resolveLodTier(40)).toBe("far");
    expect(isInViewport({ height: 20, width: 20, x: 5, y: 5 }, { height: 100, width: 100 })).toBe(
      true
    );
    expect(
      isInViewport({ height: 20, width: 20, x: 200, y: 200 }, { height: 100, width: 100 })
    ).toBe(false);

    const visual = rendering.resolveVisual({ distance: 40, id: "windmill" });
    const preloaded = await preloader.preload(preloadVisualAssetIds().slice(0, 3));

    expect(visual.lod).toBe("far");
    expect(visual.binding.assetId).toBe("environment.windmill");
    expect(preloaded.every((asset) => asset.url.length > 0)).toBe(true);
  });
});
