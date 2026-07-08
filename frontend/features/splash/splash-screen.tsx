import { AppIconPlaceholder } from "@/components/branding/app-icon-placeholder";
import { SplashLogo } from "@/components/branding/splash-logo";
import { VersionBadge } from "@/components/branding/version-badge";
import { FloatingPanel } from "@/components/ui/floating-panel";
import { LinkButton } from "@/components/ui/link-button";
import { ScreenShell } from "@/features/screens/screen-shell";

/** Renders the public entry screen for the adventure. */
export function SplashScreen() {
  return (
    <ScreenShell
      actions={
        <>
          <LinkButton href="/menu">Open storybook</LinkButton>
          <LinkButton href="/showcase" variant="secondary">
            View showcase
          </LinkButton>
        </>
      }
      description="A portfolio-ready cozy fantasy MVP with Joy Meadow gameplay, AI-ready story systems, cinematic UI, production fallbacks, and release documentation."
      eyebrow="Version 1.0 portfolio MVP"
      showVisual
      title="Flavor Odyssey"
    >
      <div className="mb-5">
        <SplashLogo />
      </div>
      <FloatingPanel className="flex flex-wrap items-center gap-3">
        <AppIconPlaceholder />
        <div>
          <p className="text-sm font-semibold text-foreground">GitHub showcase build</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Open `/showcase` for architecture, screenshots, credits, and system information.
          </p>
        </div>
        <VersionBadge />
      </FloatingPanel>
    </ScreenShell>
  );
}
