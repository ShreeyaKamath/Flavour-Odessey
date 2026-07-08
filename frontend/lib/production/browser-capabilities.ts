export type BrowserCapabilities = {
  audio: boolean;
  storage: boolean;
  webgl: boolean;
};

/** Checks whether session/local storage can be used without throwing. */
export function detectStorageAvailable(storage: Storage | undefined): boolean {
  if (!storage) {
    return false;
  }

  const key = "__flavor_odyssey_storage_probe__";
  try {
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Checks whether the browser exposes an audio constructor. */
export function detectAudioAvailable(): boolean {
  return typeof Audio !== "undefined";
}

/** Checks whether a WebGL context can be created for canvas-based scenes. */
export function detectWebGLAvailable(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function getBrowserStorage(kind: "localStorage" | "sessionStorage"): Storage | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window[kind];
  } catch {
    return undefined;
  }
}

/** Detects browser capabilities that have production fallbacks. */
export function detectBrowserCapabilities(): BrowserCapabilities {
  return {
    audio: detectAudioAvailable(),
    storage:
      detectStorageAvailable(getBrowserStorage("sessionStorage")) ||
      detectStorageAvailable(getBrowserStorage("localStorage")),
    webgl: detectWebGLAvailable()
  };
}
