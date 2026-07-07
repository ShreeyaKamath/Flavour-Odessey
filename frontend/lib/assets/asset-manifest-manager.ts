import rawManifest from "@/assets/manifest.json";
import type {
  AssetCategory,
  AssetKind,
  AssetLodTier,
  AssetManifest,
  AssetManifestEntry
} from "@/lib/assets/asset-types";

/** Provides typed lookup and validation around the active visual asset manifest. */
export class AssetManifestManager {
  private readonly entries: Map<string, AssetManifestEntry>;

  readonly manifest: AssetManifest;

  constructor(manifest: AssetManifest = rawManifest as AssetManifest) {
    this.manifest = manifest;
    this.entries = new Map(manifest.assets.map((entry) => [entry.id, entry]));
  }

  all(): AssetManifestEntry[] {
    return [...this.entries.values()];
  }

  byCategory(category: AssetCategory): AssetManifestEntry[] {
    return this.all().filter((entry) => entry.category === category);
  }

  byKind(kind: AssetKind): AssetManifestEntry[] {
    return this.all().filter((entry) => entry.kind === kind);
  }

  byTag(tag: string): AssetManifestEntry[] {
    return this.all().filter((entry) => entry.tags.includes(tag));
  }

  get(id: string): AssetManifestEntry {
    const entry = this.entries.get(id);
    if (!entry) {
      throw new Error(`Unknown asset id: ${id}`);
    }
    return entry;
  }

  has(id: string): boolean {
    return this.entries.has(id);
  }

  resolveLod(id: string, tier: AssetLodTier): AssetManifestEntry {
    const entry = this.get(id);
    const lodId = entry.lod[tier] ?? id;
    return this.get(lodId);
  }
}

export const assetManifestManager = new AssetManifestManager();
