export function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export function generateFieldPositions(count: number, seed: number, width: number, depth: number) {
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, () => ({
    rotation: (random() - 0.5) * 0.5,
    scale: 0.75 + random() * 0.55,
    x: (random() - 0.5) * width,
    z: (random() - 0.5) * depth
  }));
}
