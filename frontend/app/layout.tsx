import type { Metadata } from "next";
import { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { FontLoader } from "@/components/providers/font-loader";
import { projectBranding } from "@/lib/branding/project-branding";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Flavor Odyssey",
    template: "%s | Flavor Odyssey"
  },
  description: "A portfolio-ready cozy fantasy MVP with Joy Meadow gameplay and AI-ready systems.",
  icons: {
    apple: projectBranding.assets.appIcon,
    icon: projectBranding.assets.favicon,
    shortcut: projectBranding.assets.favicon
  },
  openGraph: {
    description:
      "Explore Flavor Odyssey, a cozy fantasy engineering showcase centered on Joy Meadow.",
    images: [
      {
        alt: "Flavor Odyssey Open Graph preview placeholder",
        height: 630,
        url: projectBranding.assets.openGraphPreview,
        width: 1200
      }
    ],
    siteName: "Flavor Odyssey",
    title: "Flavor Odyssey",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    description:
      "A cozy fantasy engineering showcase with Joy Meadow gameplay and AI-ready systems.",
    images: [projectBranding.assets.openGraphPreview],
    title: "Flavor Odyssey"
  }
};

type RootLayoutProps = {
  children: ReactNode;
};

/** Provides the document shell and application-wide providers. */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <FontLoader>
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        </FontLoader>
      </body>
    </html>
  );
}
