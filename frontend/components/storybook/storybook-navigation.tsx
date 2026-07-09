import { LinkButton } from "@/components/ui/link-button";
import { themeManager } from "@/lib/assets/theme-manager";

const tabs = [
  { href: "/world", label: "Map" },
  { href: "/game?island=joy_meadow", label: "Meadow" },
  { href: "/inventory", label: "Satchel" },
  { href: "/recipes", label: "Cookbook" },
  { href: "/journal", label: "Journal" },
  { href: "/settings", label: "Crystals" },
  { href: "/showcase", label: "Showcase" }
] as const;

/** Provides bookmark-style navigation tabs for storybook screens. */
export function StorybookNavigation() {
  return (
    <nav
      aria-label="Storybook navigation"
      className="flex flex-wrap gap-2"
      data-visual-element="bookmark"
      style={themeManager.cssVars()}
    >
      {tabs.map((tab) => (
        <LinkButton
          className="min-h-9 bg-[image:var(--storybook-bookmark-texture)] bg-cover px-3 py-1"
          href={tab.href}
          key={tab.href}
          variant="ghost"
        >
          {tab.label}
        </LinkButton>
      ))}
    </nav>
  );
}
