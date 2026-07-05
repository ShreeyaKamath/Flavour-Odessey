"use client";

import { ReactNode } from "react";

import { Loader } from "@/components/ui/loader";
import { useUiStore } from "@/stores/ui-store";

type LoadingProviderProps = {
  children: ReactNode;
};

export function LoadingProvider({ children }: LoadingProviderProps) {
  const isLoading = useUiStore((state) => state.isLoading);

  return (
    <>
      {children}
      {isLoading ? <Loader label="Loading" fullScreen /> : null}
    </>
  );
}
