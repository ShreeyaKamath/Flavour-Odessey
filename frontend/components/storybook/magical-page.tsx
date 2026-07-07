"use client";

import { ReactNode } from "react";

import { FantasyPanel } from "@/components/storybook/fantasy-panel";
import { cn } from "@/utils/cn";

type MagicalPageProps = {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title: string;
  titleId?: string;
};

/** Presents content as an illustrated page with glowing ink and procedural parchment. */
export function MagicalPage({ children, className, eyebrow, title, titleId }: MagicalPageProps) {
  return (
    <FantasyPanel className={cn("min-h-64", className)}>
      <div className="mb-5 flex items-start gap-3 border-b border-border/70 pb-4">
        <div
          aria-hidden="true"
          className="mt-1 h-10 w-10 rounded-full border border-border bg-accent/15 shadow-glow"
        />
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
          ) : null}
          <h2 className="storybook-ink font-display text-2xl font-semibold" id={titleId}>
            {title}
          </h2>
        </div>
      </div>
      {children}
    </FantasyPanel>
  );
}
