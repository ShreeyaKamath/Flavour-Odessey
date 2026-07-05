import type { Metadata } from "next";
import { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/components/providers/app-providers";
import { FontLoader } from "@/components/providers/font-loader";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Flavor Odyssey",
    template: "%s | Flavor Odyssey"
  },
  description: "Frontend foundation for the Flavor Odyssey adventure."
};

type RootLayoutProps = {
  children: ReactNode;
};

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
