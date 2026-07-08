export const projectBranding = {
  build: {
    channel: process.env.NEXT_PUBLIC_BUILD_CHANNEL ?? "portfolio",
    commit: process.env.NEXT_PUBLIC_GIT_SHA ?? "local",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0"
  },
  colors: {
    accent: "rgb(var(--color-accent))",
    background: "rgb(var(--color-background))",
    foreground: "rgb(var(--color-foreground))",
    gold: "rgb(var(--storybook-gold))",
    parchment: "rgb(var(--storybook-parchment))",
    primary: "rgb(var(--color-primary))"
  },
  contact: {
    github: "https://github.com/ShreeyaKamath/Flavour-Odessey",
    project: "Flavor Odyssey"
  },
  assets: {
    appIcon: "/brand/app-icon.svg",
    favicon: "/brand/favicon.svg",
    logo: "/brand/logo.svg",
    openGraphPreview: "/brand/og-preview.svg",
    splashLogo: "/brand/splash-logo.svg"
  },
  logo: {
    label: "Flavor Odyssey logo placeholder"
  },
  typography: {
    body: "var(--font-body)",
    display: "var(--font-display)"
  }
} as const;

export type ShowcaseFeature = {
  description: string;
  id: string;
  status: "complete" | "foundation" | "placeholder-ready";
  title: string;
};

export const showcaseFeatures: ShowcaseFeature[] = [
  {
    description:
      "A playable Joy Meadow vertical slice with collection, crafting, restoration, and save state.",
    id: "gameplay",
    status: "complete",
    title: "Joy Meadow MVP Loop"
  },
  {
    description:
      "Mock-provider AI architecture for Lumi, NPC dialogue, recipe lore, narrative text, and memory.",
    id: "ai",
    status: "foundation",
    title: "AI-Ready Story Systems"
  },
  {
    description:
      "Centralized audio, motion, cinematic, rendering, and asset pipelines with graceful fallbacks.",
    id: "production",
    status: "foundation",
    title: "Production Foundations"
  },
  {
    description:
      "Storybook UI shell, magical crafting presentation, living weather, and cinematic demo moments.",
    id: "showcase",
    status: "placeholder-ready",
    title: "Portfolio Showcase"
  }
];

export type ScreenshotSlot = {
  description: string;
  id: string;
  route: string;
  title: string;
};

export const screenshotSlots: ScreenshotSlot[] = [
  {
    description: "Opening splash and loading state.",
    id: "landing",
    route: "/",
    title: "Landing Page"
  },
  {
    description: "Opening storybook scene and demo entry points.",
    id: "main_menu",
    route: "/menu",
    title: "Main Menu"
  },
  {
    description: "Joy Meadow vertical slice route.",
    id: "gameplay",
    route: "/game?island=joy_meadow",
    title: "Gameplay"
  },
  {
    description: "Magical crafting director and recipe reveal.",
    id: "crafting",
    route: "/recipes",
    title: "Crafting"
  },
  {
    description: "NPC conversation and relationship presentation.",
    id: "npc",
    route: "/game?island=joy_meadow",
    title: "NPC Interaction"
  },
  {
    description: "Floating companion and Ask Lumi panel.",
    id: "lumi",
    route: "/game?island=joy_meadow",
    title: "Lumi"
  },
  {
    description: "Storybook shell and fantasy panels.",
    id: "storybook",
    route: "/showcase",
    title: "Storybook"
  },
  {
    description: "Living weather and time system.",
    id: "weather",
    route: "/game?island=joy_meadow",
    title: "Weather"
  },
  { description: "Journal of Memories route.", id: "journal", route: "/journal", title: "Journal" },
  {
    description: "Crystal settings and accessibility controls.",
    id: "settings",
    route: "/settings",
    title: "Settings"
  },
  { description: "Portfolio credits screen.", id: "credits", route: "/about", title: "Credits" }
];
