"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { useAuthStore } from "@/stores/auth-store";

type ProtectedRouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") {
    return (
      <div aria-live="polite" className="p-[var(--space-page)] text-muted-foreground">
        Restoring your session...
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      fallback ?? (
        <div className="p-[var(--space-page)]">
          <p className="text-foreground">Sign in to continue.</p>
          <Link className="mt-3 inline-block font-semibold text-primary" href="/auth/login">
            Go to login
          </Link>
        </div>
      )
    );
  }

  return children;
}
