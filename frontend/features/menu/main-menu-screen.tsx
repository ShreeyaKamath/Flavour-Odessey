import { GlowingBookmark } from "@/components/storybook/glowing-bookmark";
import { StorybookShell } from "@/components/storybook/storybook-shell";
import { LinkButton } from "@/components/ui/link-button";

/** Renders the primary adventure menu. */
export function MainMenuScreen() {
  return (
    <StorybookShell
      actions={
        <>
          <LinkButton href="/world">Open the map</LinkButton>
          <LinkButton href="/settings" variant="secondary">
            Crystal settings
          </LinkButton>
        </>
      }
      description="The cover opens on Joy Meadow, its pages lit by Lumi and the first restored memory."
      eyebrow="Opening storybook"
      title="Flavor Odyssey"
    >
      <div className="space-y-5">
        <GlowingBookmark label="Adventure saved" sublabel="Joy Meadow awaits" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-panel border border-border bg-surface/70 p-4">
            <h2 className="font-display text-xl font-semibold text-foreground">New adventure</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Begin where the first Heart Flavor stirs beneath the meadow.
            </p>
          </div>
          <div className="rounded-panel border border-border bg-surface/70 p-4">
            <h2 className="font-display text-xl font-semibold text-foreground">Continue</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Return to the glowing bookmark and the living weather outside the page.
            </p>
          </div>
        </div>
      </div>
    </StorybookShell>
  );
}
