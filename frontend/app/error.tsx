"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <GlassPanel className="mx-auto max-w-xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-danger">Route error</p>
      <h1 className="mt-3 font-display text-3xl">This screen could not render.</h1>
      <p className="mt-3 text-muted-foreground">The frontend route boundary caught an error.</p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </GlassPanel>
  );
}
