import { projectBranding } from "@/lib/branding/project-branding";
import { cn } from "@/utils/cn";

type VersionBadgeProps = {
  className?: string;
};

/** Displays current portfolio build and version metadata. */
export function VersionBadge({ className }: VersionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-control border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground",
        className
      )}
    >
      Version {projectBranding.build.version} / {projectBranding.build.channel}
    </span>
  );
}
