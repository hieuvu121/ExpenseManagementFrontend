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
  quick: 300, // toggles, chips, tab switch
  base: 200, // list rows, cards, toasts
  slow: 800, // sheet, route change — the rare, deliberate moments
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

/**
 * How far things move. Two values, not one.
 *
 * `TRAVEL` is for the everyday — list rows, toasts — where 8px is plenty and more
 * would be noise. `TRAVEL_LG` is for the sheet and page changes: a modal rising
 * 8px is so subtle it reads as a flicker rather than an arrival, and a crossfade
 * between two similar layouts gives the eye nothing to follow.
 *
 * Both become 0px under reduced motion.
 */
export const TRAVEL = "8px";
export const TRAVEL_LG = "16px";

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
    "--travel-lg": reduced ? "0px" : TRAVEL_LG,
  };
}
