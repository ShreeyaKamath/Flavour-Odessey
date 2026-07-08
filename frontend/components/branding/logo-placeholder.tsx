import Image from "next/image";

import { projectBranding } from "@/lib/branding/project-branding";
import { cn } from "@/utils/cn";

type LogoPlaceholderProps = {
  className?: string;
  priority?: boolean;
};

/** Renders the replaceable Flavor Odyssey logo mark used by showcase pages. */
export function LogoPlaceholder({ className, priority = false }: LogoPlaceholderProps) {
  return (
    <Image
      alt={projectBranding.logo.label}
      className={cn(
        "storybook-border storybook-parchment inline-flex aspect-square h-16 rounded-panel object-contain p-1 shadow-glow",
        className
      )}
      height={128}
      priority={priority}
      src={projectBranding.assets.logo}
      width={128}
    />
  );
}
