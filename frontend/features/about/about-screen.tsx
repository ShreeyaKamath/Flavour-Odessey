import { LogoPlaceholder } from "@/components/branding/logo-placeholder";
import { VersionBadge } from "@/components/branding/version-badge";
import { StorybookShell } from "@/components/storybook/storybook-shell";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { projectBranding } from "@/lib/branding/project-branding";

const credits = [
  "Game concept, implementation direction, and portfolio ownership: Shreeya Kamath.",
  "Engineering support: Codex-assisted incremental implementation.",
  "Open-source framework ecosystem: Next.js, React, FastAPI, SQLAlchemy, Vitest, and Tailwind CSS.",
  "Placeholder art and audio are local-safe procedural or generated placeholders."
];

/** Renders the public about, credits, and version information page. */
export function AboutScreen() {
  return (
    <StorybookShell
      actions={
        <>
          <LinkButton href="/showcase">Open showcase</LinkButton>
          <LinkButton href="/menu" variant="secondary">
            Return to menu
          </LinkButton>
        </>
      }
      description="Credits, project identity, and release details for the Flavor Odyssey portfolio build."
      eyebrow="About"
      title="Credits and Release"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <LogoPlaceholder priority />
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Flavor Odyssey</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cozy fantasy engineering showcase centered on Joy Meadow.
            </p>
          </div>
          <VersionBadge />
        </div>

        <section aria-labelledby="credits-title">
          <h2 className="font-display text-2xl font-semibold text-foreground" id="credits-title">
            Credits
          </h2>
          <div className="mt-4 grid gap-3">
            {credits.map((credit) => (
              <Card key={credit}>
                <p className="text-sm leading-6 text-muted-foreground">{credit}</p>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="release-title">
          <h2 className="font-display text-2xl font-semibold text-foreground" id="release-title">
            Release information
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Card>
              <dt className="text-sm font-semibold text-foreground">Version</dt>
              <dd className="mt-2 text-sm text-muted-foreground">
                {projectBranding.build.version}
              </dd>
            </Card>
            <Card>
              <dt className="text-sm font-semibold text-foreground">Channel</dt>
              <dd className="mt-2 text-sm text-muted-foreground">
                {projectBranding.build.channel}
              </dd>
            </Card>
            <Card>
              <dt className="text-sm font-semibold text-foreground">Repository</dt>
              <dd className="mt-2 text-sm text-muted-foreground">ShreeyaKamath/Flavour-Odessey</dd>
            </Card>
          </dl>
        </section>
      </div>
    </StorybookShell>
  );
}
