"use client";

import { useEffect, useState } from "react";

import { useOnlineStatus } from "@/hooks/use-online-status";
import {
  detectBrowserCapabilities,
  type BrowserCapabilities
} from "@/lib/production/browser-capabilities";

type ProductionNotice = {
  id: string;
  message: string;
};

function noticesFor(online: boolean, capabilities: BrowserCapabilities | null): ProductionNotice[] {
  const notices: ProductionNotice[] = [];

  if (!online) {
    notices.push({
      id: "offline",
      message:
        "You are offline. Saved local UI settings remain available; live game data may retry."
    });
  }

  if (capabilities && !capabilities.storage) {
    notices.push({
      id: "storage",
      message: "Browser storage is unavailable, so login and settings may reset after refresh."
    });
  }

  if (capabilities && !capabilities.audio) {
    notices.push({
      id: "audio",
      message: "Audio is unavailable, so the adventure will continue silently."
    });
  }

  if (capabilities && !capabilities.webgl) {
    notices.push({
      id: "webgl",
      message: "Canvas rendering is unavailable, so animated scenes will use readable fallbacks."
    });
  }

  return notices;
}

/** Surfaces production fallback states without blocking the application. */
export function ProductionStatusBanner() {
  const online = useOnlineStatus();
  const [capabilities, setCapabilities] = useState<BrowserCapabilities | null>(null);

  useEffect(() => {
    setCapabilities(detectBrowserCapabilities());
  }, []);

  const notices = noticesFor(online, capabilities);

  if (!notices.length) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-toast mx-auto max-w-3xl rounded-panel border border-border bg-background/95 px-4 py-3 text-sm text-foreground shadow-panel backdrop-blur-sm"
      role={online ? "status" : "alert"}
    >
      <ul className="space-y-1">
        {notices.map((notice) => (
          <li key={notice.id}>{notice.message}</li>
        ))}
      </ul>
    </div>
  );
}
