import rawManifest from "../../../audio/manifest.json";

import type { AudioManifest } from "@/lib/audio/types";

export const audioManifest = rawManifest as AudioManifest;

export type AudioId = keyof typeof rawManifest.assets;

export const audioIds = Object.freeze(
  Object.fromEntries(Object.keys(rawManifest.assets).map((audioId) => [audioId, audioId]))
) as { [Key in AudioId]: Key };
