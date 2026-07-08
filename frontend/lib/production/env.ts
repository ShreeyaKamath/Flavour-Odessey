type PublicEnv = Record<string, string | undefined> & {
  NEXT_PUBLIC_API_URL?: string;
  NEXT_PUBLIC_WS_URL?: string;
};

export type ProductionEnvIssue = {
  key: keyof PublicEnv;
  message: string;
  severity: "error" | "warning";
};

function isLocalUrl(value: string): boolean {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(value);
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isAbsoluteWebSocketUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "ws:" || parsed.protocol === "wss:";
  } catch {
    return false;
  }
}

/** Validates public frontend environment values used by production builds. */
export function validatePublicEnv(
  env: PublicEnv = process.env,
  nodeEnv = process.env.NODE_ENV
): ProductionEnvIssue[] {
  const issues: ProductionEnvIssue[] = [];
  const production = nodeEnv === "production";

  if (!env.NEXT_PUBLIC_API_URL) {
    issues.push({
      key: "NEXT_PUBLIC_API_URL",
      message: "NEXT_PUBLIC_API_URL must point to the deployed backend.",
      severity: production ? "error" : "warning"
    });
  } else if (!isAbsoluteHttpUrl(env.NEXT_PUBLIC_API_URL)) {
    issues.push({
      key: "NEXT_PUBLIC_API_URL",
      message: "NEXT_PUBLIC_API_URL must be an absolute http(s) URL.",
      severity: "error"
    });
  } else if (production && isLocalUrl(env.NEXT_PUBLIC_API_URL)) {
    issues.push({
      key: "NEXT_PUBLIC_API_URL",
      message: "Production builds should not target a localhost backend.",
      severity: "error"
    });
  }

  if (env.NEXT_PUBLIC_WS_URL && !isAbsoluteWebSocketUrl(env.NEXT_PUBLIC_WS_URL)) {
    issues.push({
      key: "NEXT_PUBLIC_WS_URL",
      message: "NEXT_PUBLIC_WS_URL must be an absolute ws(s) URL when provided.",
      severity: "error"
    });
  } else if (production && env.NEXT_PUBLIC_WS_URL && isLocalUrl(env.NEXT_PUBLIC_WS_URL)) {
    issues.push({
      key: "NEXT_PUBLIC_WS_URL",
      message: "Production builds should not target a localhost websocket.",
      severity: "warning"
    });
  }

  return issues;
}

/** Returns true when no production-blocking public env issues are present. */
export function isPublicEnvDeployable(
  env: PublicEnv = process.env,
  nodeEnv = process.env.NODE_ENV
): boolean {
  return validatePublicEnv(env, nodeEnv).every((issue) => issue.severity !== "error");
}
