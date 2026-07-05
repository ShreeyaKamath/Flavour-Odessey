"use client";

import { ReactNode, useEffect } from "react";

import { authSessionExpiredEvent } from "@/lib/auth/session-events";
import { useAuthStore } from "@/stores/auth-store";

type AuthProviderProps = {
  children: ReactNode;
};

/** Restores authentication and listens for session-expiry events. */
export function AuthProvider({ children }: AuthProviderProps) {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const expireSession = useAuthStore((state) => state.expireSession);

  useEffect(() => {
    window.addEventListener(authSessionExpiredEvent, expireSession);
    void restoreSession();
    return () => {
      window.removeEventListener(authSessionExpiredEvent, expireSession);
    };
  }, [expireSession, restoreSession]);

  return children;
}
