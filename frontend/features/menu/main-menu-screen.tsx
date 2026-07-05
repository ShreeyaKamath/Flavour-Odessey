import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { ScreenShell } from "@/features/screens/screen-shell";

/** Renders the primary adventure menu. */
export function MainMenuScreen() {
  return (
    <ScreenShell
      actions={
        <>
          <LinkButton href="/world">Continue</LinkButton>
          <LinkButton href="/settings" variant="secondary">
            Settings
          </LinkButton>
        </>
      }
      description="Navigation, layout, theme, motion, and provider systems are ready for future adventure flows."
      eyebrow="Main menu"
      showVisual
      title="Choose the next foundation route"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-foreground">New adventure</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder entry point for a later saved game flow.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold text-foreground">Continue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Placeholder route for future authenticated progress.
          </p>
        </Card>
      </div>
    </ScreenShell>
  );
}
