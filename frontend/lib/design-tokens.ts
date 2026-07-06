export const motionTokens = {
  delay: {
    particle: 0.06
  },
  distance: {
    ambient: 6,
    collect: 18,
    panel: 12,
    scene: 24
  },
  duration: {
    ambient: 5.2,
    hover: 0.15,
    panel: 0.3,
    particle: 0.8,
    press: 0.15,
    reveal: 0.45,
    scene: 0.9,
    skeleton: 1.4
  },
  easing: {
    entrance: [0.16, 1, 0.3, 1] as [number, number, number, number],
    soft: [0.22, 1, 0.36, 1] as [number, number, number, number]
  },
  rotation: {
    bookPage: 82,
    page: 8,
    sparkle: 90
  },
  scale: {
    collect: 1.04,
    hover: 1.03,
    press: 0.98,
    reveal: 0.96
  }
} as const;
