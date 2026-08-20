/**
 * The single source of truth for Housemate's colours.
 *
 * `tailwind.config.js` builds its `theme.colors` from this object, and the
 * consumers that cannot read a Tailwind class — Chart.js, which takes literal
 * colours, and the category dots, which are inline styles — import it directly.
 * There used to be three hand-synchronised copies of these hexes.
 *
 * Contrast: `-Text` variants are measured to clear WCAG AA (4.5:1) on `paper`
 * and `card`; the plain names are for fills and borders, and `inkMuted` is
 * decorative only at 2.54:1.
 */
export const PALETTE = {
  paper: "#EDF0EA",
  card: "#FBFCF9",

  ink: "#141F1D",
  inkSoft: "#5C6A64",
  inkMuted: "#8E9A93",
  inkInvert: "#F3F5F0",

  line: "#D6DCD1",
  lineSoft: "#E6EAE1",
  hover: "#E3E8DF",

  teal: "#00857D",
  tealDark: "#00655F",
  tealWash: "#DFEDEC",

  moss: "#1E7A4B",
  mossText: "#17603B",
  mossWash: "#E1EFE6",

  rose: "#C33F5C",
  roseText: "#A32B46",
  roseWash: "#F6E3E7",

  cobalt: "#2F5FA8",
  cobaltText: "#2A5596",
  cobaltWash: "#E7EDF7",

  gold: "#A87A1F",
  goldText: "#8A6314",
  goldWash: "#F4EEDD",
  goldTint: "#F7F2E4",

  /** Area fill under the statistics line. */
  tealFill: "rgba(0,133,125,.12)",
} as const;
