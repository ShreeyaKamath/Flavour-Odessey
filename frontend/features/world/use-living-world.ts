"use client";

import { useEffect, useMemo, useState } from "react";

import { usePageVisibility } from "@/hooks/use-page-visibility";
import { audioEvents } from "@/lib/audio/audio-events";
import { environmentTiming } from "@/lib/world/joy-meadow-config";
import { TimeManager, WeatherManager, type LivingWorldSnapshot } from "@/lib/world/weather-system";

function resolveLivingWorld(time: TimeManager, weather: WeatherManager) {
  const now = new Date();
  const timeState = time.resolve(now);
  return weather.resolve(now, timeState.timeOfDay);
}

/** Streams a paused-when-hidden weather and time snapshot for Joy Meadow. */
export function useLivingWorld() {
  const visible = usePageVisibility();
  const time = useMemo(() => new TimeManager(), []);
  const weather = useMemo(() => new WeatherManager(), []);
  const [world, setWorld] = useState<LivingWorldSnapshot>(() => resolveLivingWorld(time, weather));

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timer = window.setInterval(() => {
      setWorld((current) => {
        const next = resolveLivingWorld(time, weather);
        if (next.condition !== current.condition || next.timeOfDay !== current.timeOfDay) {
          audioEvents.publish("WeatherChanged");
        }
        return next;
      });
    }, environmentTiming.clockRefreshMs);
    return () => window.clearInterval(timer);
  }, [time, visible, weather]);

  return {
    paused: !visible,
    world
  };
}
