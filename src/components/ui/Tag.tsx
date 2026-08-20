import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Tone = "ai" | "settle" | "custom";

const TONES: Record<Tone, string> = {
  ai: "bg-cobalt-wash text-cobalt-text",
  settle: "bg-gold-wash text-gold-text",
  custom: "bg-teal-wash text-teal-dark",
};

/** Small inline markers on an expense row: AI, custom split, settle up. */
export function Tag({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-[3px] px-[5px] py-0.5 text-[11px] font-semibold uppercase tracking-tag",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
