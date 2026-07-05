"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

import { AnimatedContainer } from "@/components/ui/animated-container";
import { GlassPanel } from "@/components/ui/glass-panel";

const FoundationScene = dynamic(
  () => import("@/components/visual/foundation-scene").then((module) => module.FoundationScene),
  {
    loading: () => <div className="h-64 rounded-panel border border-border bg-muted" />,
    ssr: false
  }
);

type ScreenShellProps = {
  actions?: ReactNode;
  children?: ReactNode;
  description: string;
  eyebrow: string;
  showVisual?: boolean;
  title: string;
};

export function ScreenShell({
  actions,
  children,
  description,
  eyebrow,
  showVisual = false,
  title
}: ScreenShellProps) {
  return (
    <AnimatedContainer className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)]">
      <GlassPanel className="flex min-h-[28rem] flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </GlassPanel>
      <div className="min-h-64 overflow-hidden rounded-panel border border-border bg-surface shadow-panel">
        {showVisual ? (
          <FoundationScene />
        ) : (
          <div className="flex h-full min-h-64 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Placeholder surface reserved for future feature work.
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}
