/**
 * Hex values for consumers that cannot read Tailwind classes — Chart.js takes
 * literal colours. These mirror `theme.extend.colors` in tailwind.config.js;
 * change both together.
 */
export const PALETTE = {
  card: "#FBFCF9",
  line: "#E6EAE1",
  tick: "#8E9A93",
  teal: "#00857D",
  gold: "#A87A1F",
  rose: "#C33F5C",
  tealFill: "rgba(0,133,125,.12)",
} as const;
