import { AssetManager, assetManager } from "@/lib/assets/asset-manager";
import type { AssetResolution } from "@/lib/assets/asset-types";

const defaultIconBindings = {
  bookmark: "icon.bookmark",
  inventory: "icon.satchel",
  journal: "ui.book_texture",
  recipe: "ice_cream.golden_vanilla_bloom",
  settings: "ui.crystal_texture",
  world: "environment.windmill"
} as const;

export type IconId = keyof typeof defaultIconBindings;

/** Resolves semantic UI icon names to asset ids from the active pack. */
export class IconRegistry {
  constructor(
    private readonly assets: AssetManager = assetManager,
    private readonly bindings: Record<IconId, string> = defaultIconBindings
  ) {}

  assetId(iconId: IconId): string {
    return this.bindings[iconId];
  }

  resolve(iconId: IconId): AssetResolution {
    return this.assets.resolve(this.assetId(iconId));
  }
}

export const iconRegistry = new IconRegistry();
