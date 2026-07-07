type Disposable = {
  dispose?: () => void;
};

function disposeValue(value: unknown): void {
  if (value && typeof value === "object" && "dispose" in value) {
    const disposable = value as Disposable;
    disposable.dispose?.();
  }
}

/** Small keyed cache with optional disposal for image, texture, and atlas handles. */
export class AssetCache<TValue> {
  private readonly values = new Map<string, TValue>();

  clear(): void {
    for (const value of this.values.values()) {
      disposeValue(value);
    }
    this.values.clear();
  }

  delete(key: string): boolean {
    const value = this.values.get(key);
    disposeValue(value);
    return this.values.delete(key);
  }

  get(key: string): TValue | undefined {
    return this.values.get(key);
  }

  has(key: string): boolean {
    return this.values.has(key);
  }

  keys(): string[] {
    return [...this.values.keys()];
  }

  set(key: string, value: TValue): TValue {
    this.values.set(key, value);
    return value;
  }

  size(): number {
    return this.values.size;
  }
}
