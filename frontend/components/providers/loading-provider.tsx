"use client";

import { ReactNode } from "react";

import { Loader } from "@/components/ui/loader";
import { useUiStore } from "@/stores/ui-store";

type LoadingProviderProps = {
  children: ReactNode;
};

/** Displays the global loading overlay requested by the UI store. */
export function LoadingProvider({ children }: LoadingProviderProps) {
  const isLoading = useUiStore((state) => state.isLoading);

  return (
    <>
      {children}
      {isLoading ? <Loader label="Loading" fullScreen /> : null}
    </>
  );
}
