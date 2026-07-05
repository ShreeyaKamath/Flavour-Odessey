import { ReactNode } from "react";

import { GlobalNavigation } from "@/components/navigation/global-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <a
        className="sr-only-focusable fixed left-4 top-4 z-toast rounded-control bg-surface px-3 py-2"
        href="#main"
      >
        Skip to content
      </a>
      <GlobalNavigation />
      <main
        className="min-h-[calc(100vh-4rem)] px-[var(--space-page)] py-8"
        id="main"
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}
