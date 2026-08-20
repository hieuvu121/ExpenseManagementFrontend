import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Tone = "pending" | "accepted" | "declined";

const TONES: Record<Tone, string> = {
  pending: "bg-gold-wash text-gold-text",
  accepted: "bg-moss-wash text-moss-text",
  declined: "bg-rose-wash text-rose-text",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-2 py-0.5 text-ui-2xs font-semibold uppercase tracking-[.06em]",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
