import { FloatingPanel } from "@/components/ui/floating-panel";
import { LinkButton } from "@/components/ui/link-button";
import { ScreenShell } from "@/features/screens/screen-shell";

/** Renders the public entry screen for the adventure. */
export function SplashScreen() {
  return (
    <ScreenShell
      actions={<LinkButton href="/menu">Enter foundation</LinkButton>}
      description="A frontend shell for the future cozy adventure, with providers, design tokens, routing, and accessibility already in place."
      eyebrow="Frontend foundation"
      showVisual
      title="Flavor Odyssey"
    >
      <FloatingPanel>
        <p className="text-sm text-muted-foreground">
          Phase 3 placeholder. No gameplay systems are active.
        </p>
      </FloatingPanel>
    </ScreenShell>
  );
}
