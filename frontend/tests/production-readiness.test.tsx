import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProductionStatusBanner } from "@/components/production/production-status-banner";
import { AssetManager, AssetManifestManager, AssetPreloader } from "@/lib/assets";
import type { AssetManifest } from "@/lib/assets/asset-types";
import {
  detectAudioAvailable,
  detectStorageAvailable,
  detectWebGLAvailable
} from "@/lib/production/browser-capabilities";
import { capParticleCount, shouldRunOptionalAnimation } from "@/lib/production/performance";
import { validatePublicEnv } from "@/lib/production/env";

const manifestWithBrokenImage: AssetManifest = {
  activePackId: "test",
  assets: [
    {
      category: "ui",
      id: "ui.broken",
      kind: "texture",
      lod: {
        far: "ui.broken",
        medium: "ui.broken",
        near: "ui.broken"
      },
      placeholder: {
        label: "Broken",
        primary: "#ffffff",
        secondary: "#000000"
      },
      src: "/missing-image.png",
      tags: []
    }
  ],
  packs: [
    {
      description: "Test pack",
      id: "test",
      label: "Test"
    }
  ],
  version: 1
};

class FailingImage {
  onerror: (() => void) | null = null;
  onload: (() => void) | null = null;

  set src(_value: string) {
    this.onerror?.();
  }
}

describe("production readiness helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("flags production public env values that would point at local services", () => {
    const issues = validatePublicEnv(
      {
        NEXT_PUBLIC_API_URL: "http://localhost:8000",
        NEXT_PUBLIC_WS_URL: "ws://localhost:8000/ws/game"
      },
      "production"
    );

    expect(issues.map((issue) => issue.key)).toEqual(["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_WS_URL"]);
    expect(issues[0].severity).toBe("error");
  });

  it("detects browser fallback capabilities without crashing", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    expect(detectStorageAvailable(undefined)).toBe(false);
    expect(detectStorageAvailable(window.sessionStorage)).toBe(true);
    expect(typeof detectAudioAvailable()).toBe("boolean");
    expect(detectWebGLAvailable()).toBe(false);
  });

  it("falls back to generated placeholders when asset image loading fails", async () => {
    vi.stubGlobal("Image", FailingImage);

    const preloader = new AssetPreloader(
      new AssetManager(new AssetManifestManager(manifestWithBrokenImage))
    );

    await expect(preloader.preloadOne("ui.broken")).resolves.toMatchObject({
      assetId: "ui.broken",
      placeholder: true
    });
  });

  it("centralizes optional animation and particle budgets", () => {
    expect(shouldRunOptionalAnimation({ reducedMotion: false, visible: true })).toBe(true);
    expect(shouldRunOptionalAnimation({ reducedMotion: true, visible: true })).toBe(false);
    expect(capParticleCount(999)).toBe(260);
  });

  it("shows a friendly offline recovery notice", () => {
    vi.spyOn(window.navigator, "onLine", "get").mockReturnValue(false);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);

    render(<ProductionStatusBanner />);

    expect(screen.getByRole("alert")).toHaveTextContent("You are offline");
  });
});
