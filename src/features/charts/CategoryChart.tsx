import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { CATEGORIES } from "../../constants/categories";
import { PALETTE } from "../../constants/palette";
import type { CategoryId, Household } from "../../types/domain";
import { isLive } from "../../utils/balances";
import { sameMonth, TODAY } from "../../utils/date";
import { money } from "./chartTheme";
import { EmptyState } from "../../components/common/EmptyState";

/** This month's approved spend, split by category. */
export function CategoryChart({ household }: { household: Household }) {
  const totals = {} as Record<CategoryId, number>;
  household.expenses
    .filter((e) => isLive(e) && sameMonth(e.date, TODAY))
    .forEach((e) => {
      totals[e.category] = (totals[e.category] ?? 0) + e.amount;
    });

  const keys = Object.keys(totals) as CategoryId[];
  if (!keys.length) {
    return <EmptyState title="Nothing yet" variant="bare">No approved expenses this month.</EmptyState>;
  }

  const data: ChartData<"doughnut"> = {
    labels: keys.map((k) => CATEGORIES[k].label),
    datasets: [
      {
        data: keys.map((k) => totals[k]),
        backgroundColor: keys.map((k) => CATEGORIES[k].color),
        borderColor: PALETTE.card,
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "58%",
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 9, boxHeight: 9, usePointStyle: true, pointStyle: "circle", padding: 9 },
      },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${money(ctx.parsed)}` } },
    },
  };

  return <Doughnut data={data} options={options} />;
}
