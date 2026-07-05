import { ReactNode } from "react";

import { fontLoader } from "@/lib/fonts";
import { cn } from "@/utils/cn";

type FontLoaderProps = {
  children: ReactNode;
};

export function FontLoader({ children }: FontLoaderProps) {
  return <div className={cn(fontLoader.bodyClassName, "min-h-screen")}>{children}</div>;
}
