import { describe, expect, it } from "vitest";
import { DURATION, DURATION_REDUCED } from "../constants/motion";
import { resolveDuration } from "./usePresence";

describe("resolveDuration", () => {
  it("uses the full duration normally", () => {
    expect(resolveDuration("slow", false)).toBe(DURATION.slow);
  });

  // The bug this exists to prevent: CSS shortens the exit to 100ms but the timer
  // still waits 280ms, so the element sits invisible for 180ms and the list feels
  // stuck. Invisible in normal mode; only reproducible with the OS setting on.
  it("uses the reduced duration when motion is reduced", () => {
    expect(resolveDuration("slow", true)).toBe(DURATION_REDUCED.slow);
    expect(resolveDuration("base", true)).toBe(DURATION_REDUCED.base);
  });

  it("never returns zero, so an exit always has a frame to render", () => {
    for (const name of ["instant", "quick", "base", "slow"] as const) {
      expect(resolveDuration(name, true)).toBeGreaterThan(0);
      expect(resolveDuration(name, false)).toBeGreaterThan(0);
    }
  });
});
