import type { NpcState } from "@/features/npcs/use-npcs";
import { assetManager } from "@/lib/assets/asset-manager";
import type { AssetResolution } from "@/lib/assets/asset-types";

const npcAssetKeys: Partial<Record<NpcState["npc_id"], string>> = {
  joy_meadow_baker: "npc_baker",
  joy_meadow_child_explorer: "npc_child_explorer",
  joy_meadow_gardener: "npc_gardener",
  joy_meadow_keeper: "npc_meadow_keeper",
  joy_meadow_traveling_merchant: "npc_traveling_merchant"
};

function resolveAsset(assetId: string): AssetResolution | null {
  try {
    return assetManager.resolve(assetId);
  } catch {
    return null;
  }
}

/** Converts manifest portrait keys into deterministic painted-placeholder initials. */
export class PortraitRenderer {
  constructor(private readonly npc: NpcState) {}

  initials() {
    return this.npc.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  fallbackGlyph() {
    return this.npc.emotion_icon || this.initials();
  }

  label() {
    return `${this.npc.name} portrait, ${this.npc.current_mood}`;
  }

  portraitAssetId() {
    if (this.npc.portrait.startsWith("portrait.")) {
      return this.npc.portrait;
    }
    return `portrait.${npcAssetKeys[this.npc.npc_id] ?? this.npc.npc_id}`;
  }

  resolvePortrait() {
    return resolveAsset(this.portraitAssetId());
  }

  spriteAssetId(kind: "idle" | "walk" = "idle") {
    const key = npcAssetKeys[this.npc.npc_id] ?? this.npc.npc_id;
    return `character.${key}_${kind}`;
  }

  resolveSprite(kind: "idle" | "walk" = "idle") {
    return resolveAsset(this.spriteAssetId(kind));
  }
}
