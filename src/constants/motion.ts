/**
 * The single source of truth for motion.
 *
 * These numbers are consumed twice: `tailwind.config.js` emits them as CSS custom
 * properties, and `usePresence` reads them to decide how long to keep an exiting
 * element mounted. If the two ever disagree, elements sit invisible on screen — so
 * they come from here and nowhere else. Same pattern as `palette.ts`.
 *
 * Brief: "barely there". Motion you notice only if you look for it. Its job is
 * continuity, not delight.
 */
export const DURATION = {
  instant: 90, // hover, focus, press
  quick: 140, // toggles, chips, tab switch
  base: 200, // list rows, cards, toasts
  slow: 280, // sheet, route change
} as const;

/**
 * Under `prefers-reduced-motion`. Not zero: opacity crossfades are safe for
 * vestibular disorders — WCAG 2.3.3 is about motion, not brightness — and removing
 * them entirely means the user gets no feedback that anything happened.
 */
export const DURATION_REDUCED = {
  instant: 1,
  quick: 1,
  base: 100,
  slow: 100,
} as const;

export type DurationName = keyof typeof DURATION;

export const EASING = {
  standard: "cubic-bezier(.2, 0, 0, 1)",
  exit: "cubic-bezier(.4, 0, 1, 1)",
} as const;

/** The only distance anything moves. Becomes 0px under reduced motion. */
export const TRAVEL = "8px";

/** The `:root` custom-property block, for the Tailwind plugin to emit. */
export function motionVars(reduced: boolean): Record<string, string> {
  const d = reduced ? DURATION_REDUCED : DURATION;
  return {
    "--dur-instant": `${d.instant}ms`,
    "--dur-quick": `${d.quick}ms`,
    "--dur-base": `${d.base}ms`,
    "--dur-slow": `${d.slow}ms`,
    "--ease-standard": EASING.standard,
    "--ease-exit": EASING.exit,
    "--travel": reduced ? "0px" : TRAVEL,
  };
}
