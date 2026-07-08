"use client";

import { Loader } from "@/components/ui/loader";

type RouteLoadingProps = {
  label: string;
};

/** Provides a shared accessible loading state for route-level code splitting. */
export function RouteLoading({ label }: RouteLoadingProps) {
  return (
    <div className="mx-auto flex min-h-[24rem] max-w-4xl items-center justify-center p-8">
      <Loader label={label} />
    </div>
  );
}
