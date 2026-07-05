import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    screens: {
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem"
    },
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--color-primary-foreground) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--color-muted-foreground) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)"
      },
      borderRadius: {
        panel: "var(--radius-panel)",
        control: "var(--radius-control)"
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        glow: "var(--shadow-glow)"
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      transitionDuration: {
        hover: "var(--motion-hover)"
      },
      transitionTimingFunction: {
        soft: "var(--ease-soft)"
      },
      zIndex: {
        navigation: "var(--z-navigation)",
        overlay: "var(--z-overlay)",
        toast: "var(--z-toast)"
      }
    }
  },
  plugins: []
};

export default config;
