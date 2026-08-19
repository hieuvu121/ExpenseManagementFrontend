import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type Tone = "pending" | "accepted" | "declined";

const TONES: Record<Tone, string> = {
  pending: "bg-gold-wash text-gold",
  accepted: "bg-moss-wash text-moss",
  declined: "bg-rose-wash text-rose",
};

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-2 py-[3px] text-[10.5px] font-semibold uppercase tracking-[.06em]",
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}
