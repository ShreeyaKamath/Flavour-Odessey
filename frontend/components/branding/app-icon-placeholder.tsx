import Image from "next/image";

import { projectBranding } from "@/lib/branding/project-branding";

/** Renders the replaceable app icon placeholder for release and showcase screens. */
export function AppIconPlaceholder() {
  return (
    <Image
      alt="Flavor Odyssey app icon placeholder"
      className="storybook-border storybook-parchment h-12 rounded-panel object-contain p-1 shadow-glow"
      height={96}
      priority
      src={projectBranding.assets.appIcon}
      width={96}
    />
  );
}
