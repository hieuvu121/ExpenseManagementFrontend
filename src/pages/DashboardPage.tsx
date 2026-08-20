import { useState } from "react";
import { useOutletContext } from "react-router";
import type { Household } from "../types/domain";
import { compact } from "../utils/money";
import { Card, CardHeader } from "../components/ui/Card";
import { Segmented } from "../components/ui/Segmented";
import { SummaryTiles } from "../features/dashboard/SummaryTiles";
import { PendingExpenses } from "../features/expenses/PendingExpenses";
import { RecentExpensesTable } from "../features/expenses/RecentExpensesTable";
import { DailyExpenseChart } from "../features/charts/DailyExpenseChart";
import { StatisticsChart, type StatsMode } from "../features/charts/StatisticsChart";
import { CategoryChart } from "../features/charts/CategoryChart";

const MODES: { value: StatsMode; label: string }[] = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
];

export default function DashboardPage() {
  const household = useOutletContext<Household>();
  const [mode, setMode] = useState<StatsMode>("day");

  return (
    <>
      <SummaryTiles household={household} />

      <section className="mt-6.5">
        <PendingExpenses household={household} />
      </section>

      <section className="mt-6.5">
        <Card>
          <CardHeader
            title="Daily expense"
            subtitle={`Last 7 days against the ${compact(household.budget)} ₫ daily limit`}
          />
          <div className="relative h-[180px] shell:h-[210px]">
            <DailyExpenseChart household={household} />
          </div>
        </Card>
      </section>

      <div className="mt-6.5 grid gap-3.5 shell:grid-cols-[1.55fr_1fr]">
        <Card>
          <CardHeader
            title="Statistics"
            subtitle="Total household spend over time"
            action={<Segmented options={MODES} value={mode} onChange={setMode} />}
          />
          <div className="relative h-[180px] shell:h-[212px]">
            <StatisticsChart household={household} mode={mode} />
          </div>
        </Card>

        <Card>
          <CardHeader title="By category" subtitle="This month, approved only" />
          <div className="relative h-[180px] shell:h-[212px]">
            <CategoryChart household={household} />
          </div>
        </Card>
      </div>

      <section className="mt-6.5">
        <RecentExpensesTable household={household} />
      </section>
    </>
  );
}
