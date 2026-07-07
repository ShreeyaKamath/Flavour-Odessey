import { AssetManifestManager, assetManifestManager } from "@/lib/assets/asset-manifest-manager";
import type {
  AssetCategory,
  AssetLodTier,
  AssetManifestEntry,
  AssetResolution
} from "@/lib/assets/asset-types";

function escapeSvgText(value: string): string {
  return value.replace(/[&<>"]/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return character;
    }
  });
}

export function createPlaceholderDataUri(entry: AssetManifestEntry): string {
  const label = escapeSvgText(entry.placeholder.label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${label}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${entry.placeholder.primary}"/><stop offset="1" stop-color="${entry.placeholder.secondary}"/></linearGradient></defs><rect width="256" height="256" rx="42" fill="url(#g)"/><circle cx="196" cy="62" r="30" fill="rgba(255,255,255,.42)"/><text x="128" y="140" text-anchor="middle" font-family="serif" font-size="30" font-weight="700" fill="rgba(35,25,20,.78)">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Resolves semantic asset ids to replaceable URLs with generated placeholders. */
export class AssetManager {
  constructor(private readonly manifests: AssetManifestManager = assetManifestManager) {}

  all(): AssetManifestEntry[] {
    return this.manifests.all();
  }

  byCategory(category: AssetCategory): AssetManifestEntry[] {
    return this.manifests.byCategory(category);
  }

  get(id: string): AssetManifestEntry {
    return this.manifests.get(id);
  }

  placeholderUrl(id: string): string {
    return createPlaceholderDataUri(this.get(id));
  }

  resolve(id: string, lod: AssetLodTier = "near"): AssetResolution {
    const entry = this.manifests.resolveLod(id, lod);
    return {
      entry,
      placeholder: !entry.src,
      url: entry.src ?? createPlaceholderDataUri(entry)
    };
  }
}

export const assetManager = new AssetManager();
