import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { AssetResolution, ThemeAssetBinding, ThemeAssetRole } from "@/lib/assets/asset-types";

export const storybookThemeAssets: ThemeAssetBinding = {
  bookmark: "ui.bookmark_texture",
  book: "ui.book_texture",
  border: "ui.gold_border",
  button: "ui.gold_border",
  crystal: "ui.crystal_texture",
  goldBorder: "ui.gold_border",
  inkSparkle: "ui.ink_sparkle",
  pageEdge: "ui.page_edge",
  parchment: "ui.parchment_texture",
  ribbon: "ui.ribbon_texture",
  tabs: "ui.book_texture",
  wood: "ui.wood_texture"
};

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

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
      Object.entries(this.themeAssets).flatMap(([role, assetId]) => {
        const cssRole = toKebabCase(role);
        const assetUrl = `url("${this.assets.resolve(assetId).url}")`;

        return [
          [`--asset-${role}`, assetUrl],
          [`--asset-${cssRole}`, assetUrl],
          [`--storybook-${cssRole}-texture`, assetUrl]
        ];
      })
    );
  }

  resolve(role: ThemeAssetRole): AssetResolution {
    return this.assets.resolve(this.assetId(role));
  }
}

export const themeManager = new ThemeManager();
