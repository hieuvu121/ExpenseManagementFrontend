import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { PALETTE } from "../../constants/palette";
import { compact, vnd } from "../../utils/money";

// Chart.js v4 is tree-shaken — every controller, element and scale in use has
// to be registered explicitly or the chart renders blank.
Chart.register(
  BarController,
  LineController,
  DoughnutController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
);

Chart.defaults.font.family = '"Be Vietnam Pro", system-ui, sans-serif';
Chart.defaults.font.size = 11;
Chart.defaults.color = PALETTE.inkSoft;

export const money = (n: number) => `${vnd(n)} ₫`;

/** Shared cartesian axes: no vertical gridlines, compact money on the y axis. */
export const AXES = {
  x: {
    grid: { display: false },
    border: { color: PALETTE.line },
    ticks: { color: PALETTE.inkSoft },
  },
  y: {
    beginAtZero: true,
    grid: { color: PALETTE.lineSoft },
    border: { display: false },
    ticks: { color: PALETTE.inkSoft, callback: (v: string | number) => compact(Number(v)), maxTicksLimit: 5 },
  },
} satisfies ChartOptions<"bar">["scales"];

/**
 * Tooltip label text. Taken as a plain helper rather than a shared options
 * object so each chart's callback keeps its own precisely inferred context
 * type — Chart.js types `parsed.y` as nullable and per chart type.
 */
export const moneyLabel = (label: string | undefined, value: number | null) =>
  `${label}: ${money(value ?? 0)}`;
