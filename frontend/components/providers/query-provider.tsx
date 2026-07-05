"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";

import { authIdentityChangedEvent } from "@/lib/auth/session-events";
import { createQueryClient } from "@/lib/query-client";

type QueryProviderProps = {
  children: ReactNode;
  client?: QueryClient;
};

/** Provides TanStack Query and clears protected cache data on identity changes. */
export function QueryProvider({ children, client }: QueryProviderProps) {
  const [ownedQueryClient] = useState(() => createQueryClient());
  const queryClient = client ?? ownedQueryClient;

  useEffect(() => {
    const clearAuthenticatedState = () => queryClient.clear();
    window.addEventListener(authIdentityChangedEvent, clearAuthenticatedState);
    return () => {
      window.removeEventListener(authIdentityChangedEvent, clearAuthenticatedState);
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
