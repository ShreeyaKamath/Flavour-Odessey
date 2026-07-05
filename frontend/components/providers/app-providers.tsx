"use client";

import { ReactNode } from "react";

import { ErrorBoundary } from "@/components/error-boundary";
import { AccessibilityProvider } from "@/components/providers/accessibility-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AudioProvider } from "@/components/providers/audio-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WebSocketProvider } from "@/components/providers/websocket-provider";
import { Toast } from "@/components/ui/toast";

type AppProvidersProps = {
  children: ReactNode;
};

/** Composes application-wide state, service, and error providers. */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <AccessibilityProvider>
              <AudioProvider>
                <WebSocketProvider>
                  <LoadingProvider>
                    {children}
                    <Toast />
                  </LoadingProvider>
                </WebSocketProvider>
              </AudioProvider>
            </AccessibilityProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
