import Image from "next/image";

import { projectBranding } from "@/lib/branding/project-branding";
import { cn } from "@/utils/cn";

type SplashLogoProps = {
  className?: string;
};

/** Renders the replaceable wide splash logo asset. */
export function SplashLogo({ className }: SplashLogoProps) {
  return (
    <Image
      alt="Flavor Odyssey splash logo placeholder"
      className={cn("w-full max-w-2xl rounded-panel object-contain shadow-panel", className)}
      height={360}
      priority
      src={projectBranding.assets.splashLogo}
      width={960}
    />
  );
}
