import { describe, expect, it } from "vitest";
import { DURATION, DURATION_REDUCED, motionVars, TRAVEL } from "./motion";

describe("motionVars", () => {
  it("emits every duration as a CSS custom property in ms", () => {
    const vars = motionVars(false);
    expect(vars["--dur-instant"]).toBe(`${DURATION.instant}ms`);
    expect(vars["--dur-quick"]).toBe(`${DURATION.quick}ms`);
    expect(vars["--dur-base"]).toBe(`${DURATION.base}ms`);
    expect(vars["--dur-slow"]).toBe(`${DURATION.slow}ms`);
  });

  it("emits the full travel distance normally", () => {
    expect(motionVars(false)["--travel"]).toBe(TRAVEL);
  });

  // The whole reduced-motion policy rests on this: movement goes to zero while
  // opacity still has a duration to fade over.
  it("zeroes travel but keeps a fade duration when motion is reduced", () => {
    const vars = motionVars(true);
    expect(vars["--travel"]).toBe("0px");
    expect(vars["--dur-base"]).toBe(`${DURATION_REDUCED.base}ms`);
    expect(DURATION_REDUCED.base).toBeGreaterThan(0);
  });

  it("emits the same set of keys in both modes, so nothing falls back to unset", () => {
    expect(Object.keys(motionVars(true)).sort()).toEqual(Object.keys(motionVars(false)).sort());
  });
});
