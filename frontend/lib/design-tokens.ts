export const colorTokens = {
  background: "rgb(var(--color-background))",
  foreground: "rgb(var(--color-foreground))",
  surface: "rgb(var(--color-surface))",
  surfaceRaised: "rgb(var(--color-surface-raised))",
  border: "rgb(var(--color-border))",
  primary: "rgb(var(--color-primary))",
  accent: "rgb(var(--color-accent))",
  muted: "rgb(var(--color-muted))",
  danger: "rgb(var(--color-danger))"
} as const;

export const spacingTokens = {
  page: "var(--space-page)",
  control: "0.75rem",
  panel: "1rem",
  section: "2rem"
} as const;

export const animationTokens = {
  hover: "var(--motion-hover)",
  press: "var(--motion-press)",
  panel: "var(--motion-panel)",
  scene: "var(--motion-scene)",
  float: "var(--motion-float)"
} as const;

export const motionTokens = {
  hoverScale: 1.03,
  pressScale: 0.98,
  panelOffset: 12,
  easing: [0.22, 1, 0.36, 1]
} as const;

export const responsiveTokens = {
  contentMaxWidth: "72rem",
  readableMaxWidth: "44rem"
} as const;

export const zIndexTokens = {
  navigation: "var(--z-navigation)",
  overlay: "var(--z-overlay)",
  toast: "var(--z-toast)"
} as const;
