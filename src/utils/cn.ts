import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names and lets later Tailwind utilities win over earlier ones. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Tabular monospace figures — every amount in the UI uses these. */
export const NUM = "font-mono tabular-nums tracking-[-0.02em]";

/** The small uppercase labels above values and form fields. */
export const EYEBROW =
  "text-[10.5px] font-semibold uppercase tracking-eyebrow text-ink-muted";
