import { Chart as ReactChart } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { AXES, moneyLabel } from "./chartTheme";
import { PALETTE } from "../../constants/palette";
import type { Household } from "../../types/domain";
import { daysAgo, sameDay, WEEKDAYS, dmy } from "../../utils/date";
import { isLive } from "../../utils/balances";
import { money } from "./chartTheme";
import { ChartTable } from "./ChartTable";

/** Last 7 days of household spend. Bars go red on days over the daily limit. */
export function DailyExpenseChart({ household }: { household: Household }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    const total = household.expenses
      .filter((e) => isLive(e) && sameDay(e.date, date))
      .reduce((sum, e) => sum + e.amount, 0);
    return { label: `${WEEKDAYS[date.getDay()]} ${dmy(date)}`, total };
  });

  const data: ChartData<"bar" | "line"> = {
    labels: days.map((d) => d.label),
    datasets: [
      {
        type: "bar",
        label: "Spent",
        data: days.map((d) => d.total),
        borderRadius: 3,
        maxBarThickness: 46,
        backgroundColor: days.map((d) => (d.total > household.budget ? PALETTE.rose : PALETTE.teal)),
      },
      {
        type: "line",
        label: "Daily limit",
        data: days.map(() => household.budget),
        borderColor: PALETTE.gold,
        borderWidth: 1.5,
        borderDash: [5, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: AXES,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "rectRounded" },
      },
      tooltip: { callbacks: { label: (ctx) => moneyLabel(ctx.dataset.label, ctx.parsed.y) } },
    },
  };

  return (
    <>
      <ReactChart type="bar" data={data} options={options} />
      <ChartTable
        caption={`Household spend for the last 7 days, against a daily limit of ${money(household.budget)}.`}
        columns={["Day", "Spent"]}
        rows={days.map((d) => [d.label, money(d.total)])}
      />
    </>
  );
}
