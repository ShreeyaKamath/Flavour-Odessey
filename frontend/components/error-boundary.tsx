"use client";

import { Component, ErrorInfo, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/** Catches unexpected rendering errors outside App Router boundaries. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Frontend boundary caught an error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center p-6">
          <GlassPanel className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Something paused
            </p>
            <h1 className="mt-3 font-display text-3xl text-foreground">
              The page needs a refresh.
            </h1>
            <p className="mt-3 text-muted-foreground">
              The frontend foundation caught an unexpected rendering error.
            </p>
            <Button className="mt-6" onClick={() => this.setState({ error: null })}>
              Try again
            </Button>
          </GlassPanel>
        </main>
      );
    }

    return this.props.children;
  }
}
