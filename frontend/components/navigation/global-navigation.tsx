"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import type { NavigationItem } from "@/types/navigation";
import { cn } from "@/utils/cn";

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Splash" },
  { href: "/menu", label: "Menu" },
  { href: "/world", label: "World" },
  { href: "/game", label: "Game" },
  { href: "/inventory", label: "Inventory" },
  { href: "/journal", label: "Journal" },
  { href: "/recipes", label: "Recipes" },
  { href: "/settings", label: "Settings" },
  { href: "/auth/login", label: "Login" },
  { href: "/auth/register", label: "Register" }
];

/** Renders the persistent primary application navigation. */
export function GlobalNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-navigation border-b border-border bg-background/85 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-[var(--space-page)] py-3">
        <Link className="shrink-0 font-display text-xl font-semibold text-foreground" href="/">
          Flavor Odyssey
        </Link>
        <div className="flex min-w-max items-center gap-1" role="list">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-control px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-hover ease-soft hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground"
                )}
                href={item.href}
                key={item.href}
                role="listitem"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
}
