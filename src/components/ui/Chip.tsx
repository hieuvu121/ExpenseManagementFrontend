import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ChipProps {
  children: ReactNode;
  pressed: boolean;
  onClick: () => void;
  /** `teal` marks a single choice (who paid, how to split); `ink` a multi-select. */
  tone?: "ink" | "teal";
  /**
   * Which semantics to announce. `toggle` is an independent on/off (aria-pressed);
   * `radio` is one-of-N and must sit inside a role="radiogroup" — a screen reader
   * then says "selected, 2 of 5" rather than "pressed". `none` is for chips that
   * are really an action, e.g. removing a member.
   */
  select?: "toggle" | "radio" | "none";
  ariaLabel?: string;
  className?: string;
}

export function Chip({
  children,
  pressed,
  onClick,
  tone = "ink",
  select = "toggle",
  ariaLabel,
  className,
}: ChipProps) {
  const on = tone === "teal" ? "border-teal bg-teal text-white" : "border-ink bg-ink text-ink-invert";
  return (
    <button
      type="button"
      role={select === "radio" ? "radio" : undefined}
      aria-checked={select === "radio" ? pressed : undefined}
      aria-pressed={select === "toggle" ? pressed : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "tap inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-ui-sm transition-colors",
        pressed ? on : "border-line bg-card hover:border-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
