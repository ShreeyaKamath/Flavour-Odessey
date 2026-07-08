import { projectBranding } from "@/lib/branding/project-branding";
import { cn } from "@/utils/cn";

type LogoPlaceholderProps = {
  className?: string;
};

/** Renders the replaceable Flavor Odyssey logo mark used by showcase pages. */
export function LogoPlaceholder({ className }: LogoPlaceholderProps) {
  return (
    <div
      aria-label={projectBranding.logo.label}
      className={cn(
        "storybook-border storybook-parchment inline-flex aspect-square h-16 items-center justify-center rounded-panel font-display text-2xl font-semibold storybook-ink shadow-glow",
        className
      )}
      role="img"
    >
      {projectBranding.logo.initials}
    </div>
  );
}
