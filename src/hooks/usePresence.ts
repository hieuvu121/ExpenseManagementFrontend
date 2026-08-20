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
    // `mounted` is read above but deliberately not a dependency. Including it
    // re-runs the effect the moment `setMounted(true)` lands, which clears the
    // enter timer and restarts it — harmless, but it delays the entering->present
    // flip by a render for no benefit. The effect only ever needs to react to
    // `open` changing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, name]);

  return { mounted, state };
}
