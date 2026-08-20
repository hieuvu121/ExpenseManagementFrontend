import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import { PALETTE as C } from "./src/constants/palette";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Be Vietnam Pro"', "system-ui", "sans-serif"],
      display: ['"Bricolage Grotesque"', "sans-serif"],
      mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
    },
    screens: {
      // The prototype switches to its mobile layout at 900px, so the desktop
      // shell starts one pixel above that.
      shell: "901px",
      "2xsm": "375px",
      xsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      /**
       * The type scale. There were nineteen hardcoded pixel sizes before this,
       * twelve of them within a pixel of a neighbour — differences nobody can
       * see and everybody has to maintain. Roughly a 1.2 ratio; `ui-2xs` is the
       * floor, below which small uppercase text stops being readable.
       */
      fontSize: {
        "ui-2xs": ["11px", "16px"], // tags, pills, badges, eyebrows
        "ui-xs": ["12px", "17px"], // hints, captions, meta lines
        "ui-sm": ["13px", "19px"], // buttons, chips, dense list rows
        "ui-base": ["15px", "22px"], // body
        "ui-md": ["17px", "24px"], // card titles
        "ui-lg": ["21px", "28px"], // sheet titles, wordmark
        "ui-xl": ["26px", "32px"], // tile figures, the amount field
        "ui-2xl": ["31px", "36px"], // page heading
      },
      colors: {
        paper: C.paper,
        card: C.card,
        ink: {
          DEFAULT: C.ink,
          soft: C.inkSoft, // the only secondary text grey — 4.93:1 on paper
          muted: C.inkMuted, // 2.54:1 — DECORATIVE ONLY (dots, rules)
          invert: C.inkInvert,
        },
        line: { DEFAULT: C.line, soft: C.lineSoft },
        hover: C.hover,
        // `DEFAULT` fills and borders; `dark`/`text` colour the glyphs.
        teal: { DEFAULT: C.teal, dark: C.tealDark, wash: C.tealWash },
        moss: { DEFAULT: C.moss, text: C.mossText, wash: C.mossWash },
        rose: { DEFAULT: C.rose, text: C.roseText, wash: C.roseWash },
        cobalt: { DEFAULT: C.cobalt, text: C.cobaltText, wash: C.cobaltWash },
        gold: { DEFAULT: C.gold, text: C.goldText, wash: C.goldWash, tint: C.goldTint },
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
      },
      letterSpacing: {
        eyebrow: "0.16em",
        label: "0.14em",
        tag: "0.08em",
        code: "0.12em",
      },
      keyframes: {
        "sheet-up": {
          from: { transform: "translateY(14px)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "none" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "sheet-up": "sheet-up .22s cubic-bezier(.2,.8,.2,1)",
        "fade-up": "fade-up .32s both",
        shimmer: "shimmer 1.1s linear infinite",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14.5: "3.625rem",
        15: "3.75rem",
      },
    },
  },
  plugins: [forms],
};
