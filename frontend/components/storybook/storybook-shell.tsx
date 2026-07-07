"use client";

import { ReactNode } from "react";

import { MagicalPage } from "@/components/storybook/magical-page";
import { StorybookNavigation } from "@/components/storybook/storybook-navigation";
import { themeManager } from "@/lib/assets/theme-manager";
import { audioEvents } from "@/lib/audio/audio-events";
import { cn } from "@/utils/cn";

type StorybookShellProps = {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  description: string;
  eyebrow: string;
  title: string;
};

/** Wraps feature screens in the enchanted storybook visual system. */
export function StorybookShell({
  actions,
  children,
  className,
  description,
  eyebrow,
  title
}: StorybookShellProps) {
  return (
    <section className={cn("mx-auto max-w-7xl", className)}>
      <div
        className="storybook-parchment storybook-border storybook-dust relative overflow-hidden rounded-panel px-5 py-6 sm:px-8"
        data-asset-pack={themeManager.resolve("book").entry.id}
        data-visual-element="storybook_shell"
        onMouseLeave={() => audioEvents.publish("BookClosed")}
        onMouseEnter={() => audioEvents.publish("BookOpened")}
        style={themeManager.cssVars()}
      >
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <header className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent">{eyebrow}</p>
              <h1 className="storybook-ink mt-3 font-display text-4xl font-semibold sm:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{description}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            <StorybookNavigation />
          </header>
          <MagicalPage className="bg-surface/70" title={title}>
            {children}
          </MagicalPage>
        </div>
      </div>
    </section>
  );
}
