import { GlassPanel } from "@/components/ui/glass-panel";
import { LinkButton } from "@/components/ui/link-button";

export default function NotFoundPage() {
  return (
    <GlassPanel className="mx-auto max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">Not found</p>
      <h1 className="mt-3 font-display text-3xl">That route is not part of the foundation.</h1>
      <p className="mt-3 text-muted-foreground">
        Use the global navigation to return to a placeholder screen.
      </p>
      <LinkButton className="mt-6" href="/">
        Go to splash
      </LinkButton>
    </GlassPanel>
  );
}
