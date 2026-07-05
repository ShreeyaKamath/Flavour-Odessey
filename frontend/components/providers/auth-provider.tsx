"use client";

import { ReactNode, useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  return children;
}
