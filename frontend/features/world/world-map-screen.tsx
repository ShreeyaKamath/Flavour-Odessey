"use client";

import type { components } from "@flavor/contracts/api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { Loader } from "@/components/ui/loader";
import { ScreenShell } from "@/features/screens/screen-shell";
import { useWorld } from "@/features/world/use-world";

type Island = components["schemas"]["IslandSummary"];
type Weather = components["schemas"]["WeatherStateResponse"];

function weatherLabel(weather: Weather | undefined) {
  const label = weather?.details?.label;
  return typeof label === "string" ? label : weather?.condition ?? "Calm";
}

function IslandCard({ island }: { island: Island }) {
  return (
    <Card
      className={
        island.unlocked
          ? "border-accent bg-surface-raised"
          : "border-border bg-muted/45"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            {island.emotion}
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-foreground">
            {island.name}
          </h2>
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {island.unlocked ? "Unlocked" : "Locked"}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {island.description}
      </p>

      {island.unlocked ? (
        <>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Restoration</span>
              <span>{island.restoration_level}%</span>
            </div>
            <div
              aria-label={`${island.name} restoration`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={island.restoration_level}
              className="mt-2 h-2 overflow-hidden rounded-control bg-muted"
              role="progressbar"
            >
              <div
                className="h-full bg-accent"
                style={{ width: `${island.restoration_level}%` }}
              />
            </div>
          </div>

          {island.landmarks.length ? (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground">Landmarks</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {island.landmarks.map((landmark) => (
                  <li key={landmark.key}>{landmark.name}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <LinkButton
            className="mt-5 w-full"
            href={`/game?island=${island.key}`}
          >
            Enter {island.name}
          </LinkButton>
        </>
      ) : (
        <p className="mt-5 border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
          Coming in Version 1
        </p>
      )}
    </Card>
  );
}

export function WorldMapScreen() {
  const world = useWorld();

  if (world.isPending) {
    return (
      <ScreenShell
        description="The Sea of Cream is revealing its islands."
        eyebrow="World map"
        title="Charting Gelato Terra"
      >
        <Loader label="Loading world map" />
      </ScreenShell>
    );
  }

  if (world.isError) {
    return (
      <ScreenShell
        description="The island records could not be reached."
        eyebrow="World map"
        title="The map is quiet"
      >
        <div className="space-y-4" role="alert">
          <p className="text-sm text-danger">{world.error.message}</p>
          <Button onClick={() => void world.refetch()} variant="secondary">
            Try again
          </Button>
        </div>
      </ScreenShell>
    );
  }

  const joyWeather = world.data.weather.find(
    (weather) => weather.island_key === "joy_meadow"
  );

  return (
    <ScreenShell
      description="Gelato Terra stretches across the Sea of Cream. Joy Meadow is ready for the first adventure."
      eyebrow="World map"
      showVisual
      title="Choose an island"
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-sm">
        <span className="font-semibold text-foreground">Joy Meadow weather</span>
        <span className="capitalize text-muted-foreground">
          {weatherLabel(joyWeather)}
        </span>
        {joyWeather ? (
          <span className="text-muted-foreground">
            Intensity {joyWeather.intensity}%
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {world.data.islands.map((island) => (
          <IslandCard island={island} key={island.id} />
        ))}
      </div>
    </ScreenShell>
  );
}
