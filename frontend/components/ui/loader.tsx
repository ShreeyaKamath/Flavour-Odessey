import { cn } from "@/utils/cn";

type LoaderProps = {
  fullScreen?: boolean;
  label?: string;
};

export function Loader({ fullScreen = false, label = "Loading" }: LoaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 text-sm text-muted-foreground",
        fullScreen && "fixed inset-0 z-overlay bg-background/70"
      )}
      role="status"
    >
      <span className="h-3 w-3 animate-pulse rounded-full bg-accent" />
      <span>{label}</span>
    </div>
  );
}
