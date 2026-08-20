import { useEffect, useRef, useState } from "react";
import { DURATION, DURATION_REDUCED, type DurationName } from "../constants/motion";

export type PresenceState = "entering" | "present" | "exiting";

/**
 * Which duration a timer should use. Pure so it can be tested without a renderer.
 *
 * The reduced-motion branch is not cosmetic: if the CSS shortens an exit to 100ms
 * but the timer still waits 280ms, the element stays mounted and invisible for the
 * difference.
 */
export function resolveDuration(name: DurationName, reduced: boolean): number {
  return reduced ? DURATION_REDUCED[name] : DURATION[name];
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * Keeps an element mounted while it animates out.
 *
 * React removes an element in the same instant the state changes, so there is
 * nothing left on screen to fade. This holds `mounted` true for one duration past
 * the point `open` goes false, and reports `state` so the caller can apply an exit
 * class in the meantime.
 *
 *   const { mounted, state } = usePresence(isOpen, "slow");
 *   if (!mounted) return null;
 *   return <div className={state === "exiting" ? "animate-sheet-out" : "animate-sheet-in"} />;
 */
export function usePresence(
  open: boolean,
  name: DurationName,
): { mounted: boolean; state: PresenceState } {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<PresenceState>(open ? "present" : "exiting");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timer.current);

    if (open) {
      setMounted(true);
      setState("entering");
      timer.current = setTimeout(
        () => setState("present"),
        resolveDuration(name, prefersReducedMotion()),
      );
    } else if (mounted) {
      setState("exiting");
      timer.current = setTimeout(
        () => setMounted(false),
        resolveDuration(name, prefersReducedMotion()),
      );
    }

    return () => clearTimeout(timer.current);
    // `mounted` is deliberately excluded: including it would restart the exit timer
    // when the exit itself sets mounted false, and the element would never unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, name]);

  return { mounted, state };
}
