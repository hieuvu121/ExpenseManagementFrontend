import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ChipProps {
  children: ReactNode;
  pressed: boolean;
  onClick: () => void;
  /** `teal` marks a single choice (who paid, how to split); `ink` a multi-select. */
  tone?: "ink" | "teal";
  className?: string;
}

export function Chip({ children, pressed, onClick, tone = "ink", className }: ChipProps) {
  const on = tone === "teal" ? "border-teal bg-teal text-white" : "border-ink bg-ink text-ink-invert";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[13px] transition-colors",
        pressed ? on : "border-line bg-card hover:border-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
