import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { AssetResolution, ThemeAssetBinding, ThemeAssetRole } from "@/lib/assets/asset-types";

export const storybookThemeAssets: ThemeAssetBinding = {
  bookmark: "icon.bookmark",
  book: "ui.book_texture",
  border: "ui.fantasy_border",
  button: "ui.fantasy_border",
  crystal: "ui.crystal_texture",
  parchment: "ui.parchment_texture",
  ribbon: "ui.ribbon_texture",
  tabs: "ui.book_texture",
  wood: "ui.wood_texture"
};

/** Provides theme-aware UI asset bindings so skins can swap without screen rewrites. */
export class ThemeManager {
  constructor(
    private readonly assets: AssetManager = assetManager,
    private readonly themeAssets: ThemeAssetBinding = storybookThemeAssets
  ) {}

  assetId(role: ThemeAssetRole): string {
    return this.themeAssets[role];
  }

  cssVars(): Record<string, string> {
    return Object.fromEntries(
      Object.entries(this.themeAssets).map(([role, assetId]) => [
        `--asset-${role}`,
        `url("${this.assets.resolve(assetId).url}")`
      ])
    );
  }

  resolve(role: ThemeAssetRole): AssetResolution {
    return this.assets.resolve(this.assetId(role));
  }
}

export const themeManager = new ThemeManager();
