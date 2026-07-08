"use client";

import { LogoPlaceholder } from "@/components/branding/logo-placeholder";
import { VersionBadge } from "@/components/branding/version-badge";
import { ScreenshotPlaceholder } from "@/components/showcase/screenshot-placeholder";
import { FantasyPanel } from "@/components/storybook/fantasy-panel";
import { StorybookShell } from "@/components/storybook/storybook-shell";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import {
  projectBranding,
  screenshotSlots,
  showcaseFeatures
} from "@/lib/branding/project-branding";

const architectureLayers = [
  "Next.js storybook frontend",
  "Generated OpenAPI contracts",
  "FastAPI service layer",
  "PostgreSQL persistence model",
  "AI provider abstraction",
  "Asset, audio, animation, and cinematic systems"
];

/** Renders the portfolio demo mode without changing gameplay state. */
export function ShowcaseScreen() {
  return (
    <StorybookShell
      actions={
        <>
          <LinkButton href="/about">About and credits</LinkButton>
          <LinkButton href="/game?island=joy_meadow" variant="secondary">
            Open Joy Meadow
          </LinkButton>
        </>
      }
      description="A guided portfolio view for reviewers, demo audiences, and open-source visitors."
      eyebrow="Developer mode"
      title="Flavor Odyssey Showcase"
    >
      <div className="space-y-8">
        <section className="flex flex-wrap items-center gap-4" aria-labelledby="showcase-branding">
          <LogoPlaceholder />
          <div>
            <h2
              className="font-display text-2xl font-semibold text-foreground"
              id="showcase-branding"
            >
              Portfolio build
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {projectBranding.contact.project} is ready for GitHub showcase and capstone demos.
            </p>
          </div>
          <VersionBadge />
        </section>

        <section aria-labelledby="feature-overview">
          <h2 className="font-display text-2xl font-semibold text-foreground" id="feature-overview">
            Feature overview
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {showcaseFeatures.map((feature) => (
              <Card key={feature.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  {feature.status.replace("-", " ")}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="architecture-viewer">
          <FantasyPanel>
            <h2
              className="font-display text-2xl font-semibold text-foreground"
              id="architecture-viewer"
            >
              Architecture viewer
            </h2>
            <ol className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {architectureLayers.map((layer, index) => (
                <li
                  className="rounded-control border border-border bg-surface/70 px-3 py-2"
                  key={layer}
                >
                  {index + 1}. {layer}
                </li>
              ))}
            </ol>
          </FantasyPanel>
        </section>

        <section aria-labelledby="system-information">
          <h2
            className="font-display text-2xl font-semibold text-foreground"
            id="system-information"
          >
            System information
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Card>
              <p className="text-sm font-semibold text-foreground">Version</p>
              <p className="mt-2 text-sm text-muted-foreground">{projectBranding.build.version}</p>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-foreground">Build channel</p>
              <p className="mt-2 text-sm text-muted-foreground">{projectBranding.build.channel}</p>
            </Card>
            <Card>
              <p className="text-sm font-semibold text-foreground">Commit</p>
              <p className="mt-2 text-sm text-muted-foreground">{projectBranding.build.commit}</p>
            </Card>
          </div>
        </section>

        <section aria-labelledby="screenshots">
          <h2 className="font-display text-2xl font-semibold text-foreground" id="screenshots">
            Screenshot plan
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {screenshotSlots.map((slot) => (
              <ScreenshotPlaceholder key={slot.id} slot={slot} />
            ))}
          </div>
        </section>
      </div>
    </StorybookShell>
  );
}
