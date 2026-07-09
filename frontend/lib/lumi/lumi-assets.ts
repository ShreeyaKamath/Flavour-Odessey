import { assetManager } from "@/lib/assets/asset-manager";
import type { AssetResolution } from "@/lib/assets/asset-types";
import type { LumiEmotion } from "@/lib/lumi/lumi-types";

export const lumiAssetIds = {
  celebrating: "character.lumi_celebrating",
  curious: "character.lumi_curious",
  excited: "character.lumi_excited",
  glow: "character.lumi_glow",
  happy: "character.lumi_happy",
  idle: "character.lumi_idle",
  sleepy: "character.lumi_sleepy",
  trail: "character.lumi_trail",
  worried: "character.lumi_worried"
} as const;

const emotionAssetIds: Record<LumiEmotion, string> = {
  celebrating: lumiAssetIds.celebrating,
  curious: lumiAssetIds.curious,
  excited: lumiAssetIds.excited,
  happy: lumiAssetIds.happy,
  proud: lumiAssetIds.happy,
  sleepy: lumiAssetIds.sleepy,
  thoughtful: lumiAssetIds.curious,
  worried: lumiAssetIds.worried
};

export function resolveLumiAsset(assetId: string): AssetResolution {
  return assetManager.resolve(assetId);
}

export function resolveLumiEmotionAsset(emotion: LumiEmotion): AssetResolution {
  return resolveLumiAsset(emotionAssetIds[emotion] ?? lumiAssetIds.idle);
}
