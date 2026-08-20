import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { AXES, moneyLabel } from "./chartTheme";
import { PALETTE } from "../../constants/palette";
import type { Household } from "../../types/domain";
import { daysAgo, dmy, MONTHS, sameDay, sameMonth, TODAY, WEEKDAYS } from "../../utils/date";
import { isLive } from "../../utils/balances";
import { money } from "./chartTheme";
import { ChartTable } from "./ChartTable";

export type StatsMode = "day" | "week" | "month";

interface Bucket {
  label: string;
  total: number;
}

/**
 * Buckets approved spend by day, week or month, and scales the limit line to
 * match the bucket width.
 */
function buckets(household: Household, mode: StatsMode): { data: Bucket[]; target: number } {
  const approved = household.expenses.filter(isLive);
  const sum = (predicate: (d: Date) => boolean) =>
    approved.filter((e) => predicate(e.date)).reduce((s, e) => s + e.amount, 0);

  if (mode === "day") {
    return {
      data: Array.from({ length: 7 }, (_, i) => {
        const date = daysAgo(6 - i);
        return { label: WEEKDAYS[date.getDay()], total: sum((d) => sameDay(d, date)) };
      }),
      target: household.budget,
    };
  }

  if (mode === "week") {
    return {
      data: Array.from({ length: 6 }, (_, i) => {
        const end = daysAgo((5 - i) * 7);
        const start = daysAgo((5 - i) * 7 + 6);
        return {
          label: `${MONTHS[start.getMonth()]} ${dmy(start)}`,
          total: sum((d) => d >= start && d <= end),
        };
      }),
      target: household.budget * 7,
    };
  }

  return {
    data: Array.from({ length: 6 }, (_, i) => {
      const date = new Date(TODAY.getFullYear(), TODAY.getMonth() - (5 - i), 1);
      return { label: MONTHS[date.getMonth()], total: sum((d) => sameMonth(d, date)) };
    }),
    target: household.budget * 30,
  };
}

export function StatisticsChart({ household, mode }: { household: Household; mode: StatsMode }) {
  const { data: series, target } = buckets(household, mode);

  const data: ChartData<"line"> = {
    labels: series.map((b) => b.label),
    datasets: [
      {
        label: "Spent",
        data: series.map((b) => b.total),
        borderColor: PALETTE.teal,
        backgroundColor: PALETTE.tealFill,
        borderWidth: 2,
        tension: 0.32,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: PALETTE.teal,
      },
      {
        label: "Limit",
        data: series.map(() => target),
        borderColor: PALETTE.gold,
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: AXES,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => moneyLabel(ctx.dataset.label, ctx.parsed.y) } },
    },
  };

  const period = mode === "day" ? "day" : mode === "week" ? "week" : "month";

  return (
    <>
      <Line data={data} options={options} />
      <ChartTable
        caption={`Household spend per ${period}, against a limit of ${money(target)} per ${period}.`}
        columns={[period === "day" ? "Day" : period === "week" ? "Week of" : "Month", "Spent"]}
        rows={series.map((b) => [b.label, money(b.total)])}
      />
    </>
  );
}
