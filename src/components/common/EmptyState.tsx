import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  /** `bare` drops the dashed border, for use inside an existing card. */
  variant?: "boxed" | "bare";
  className?: string;
}

export function EmptyState({ title, children, variant = "boxed", className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-ink-soft",
        variant === "boxed"
          ? "rounded-md border border-dashed border-line bg-card p-6 text-center"
          : "py-2.5 text-left",
        className,
      )}
    >
      <b className="mb-1 block text-ui-base text-ink">{title}</b>
      {children}
    </div>
  );
}
