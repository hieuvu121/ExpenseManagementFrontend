import { Link } from "react-router";
import { CATEGORIES } from "../../constants/categories";
import { PAGE_SIZE } from "../../constants/config";
import { useCursorPagination } from "../../hooks/useCursorPagination";
import type { Household } from "../../types/domain";
import { byNewest } from "../../utils/balances";
import { cn, NUM } from "../../utils/cn";
import { expenseCursor } from "../../utils/cursor";
import { vnd } from "../../utils/money";
import { Avatar } from "../../components/common/Avatar";
import { CategoryDot } from "../../components/common/CategoryDot";
import { Pager } from "../../components/common/Pager";
import { StatusPill } from "../../components/common/StatusPill";
import { Card, CardHeader } from "../../components/ui/Card";

/** The five most recent expenses, with the cursor pager underneath. */
export function RecentExpensesTable({ household }: { household: Household }) {
  const sorted = [...household.expenses].sort(byNewest);
  const pagination = useCursorPagination(
    sorted,
    expenseCursor,
    PAGE_SIZE.recent,
    household.id,
  );

  return (
    <Card>
      <CardHeader
        title="Recent expenses"
        subtitle={`Loaded ${PAGE_SIZE.recent} at a time with a cursor`}
        action={
          <Link
            to={`/households/${household.id}/ledger`}
            className="tap inline-flex items-center text-ui-xs font-semibold text-teal-dark hover:underline"
          >
            See all →
          </Link>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-ui-base">
          <thead>
            <tr>
              {["Member", "Category", "Amount", "Status"].map((head, i) => (
                <th
                  key={head}
                  className={cn(
                    "border-b border-line pb-2 text-ui-2xs font-semibold uppercase tracking-label text-ink-soft",
                    i === 1 && "hidden shell:table-cell",
                    i >= 2 ? "text-right" : "text-left",
                  )}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.visible.map((expense) => (
              <tr
                key={expense.id}
                className={cn("animate-enter", expense.status === "declined" && "opacity-50")}
              >
                <td className="border-b border-line-soft py-2.5 align-middle">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={expense.payer} />
                    <span>
                      <span className="block font-medium">{expense.payer}</span>
                      <span className="block text-ui-xs text-ink-soft">{expense.title}</span>
                    </span>
                  </div>
                </td>
                <td className="hidden border-b border-line-soft py-2.5 align-middle shell:table-cell">
                  <CategoryDot category={expense.category} />
                  {CATEGORIES[expense.category].label}
                </td>
                <td className={cn(NUM, "border-b border-line-soft py-2.5 text-right font-semibold")}>
                  {vnd(expense.amount)}
                </td>
                <td className="border-b border-line-soft py-2.5 text-right align-middle">
                  <StatusPill status={expense.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager
        pagination={pagination}
        pageSize={PAGE_SIZE.recent}
        skeletonColumns="1fr 130px 90px"
      />
    </Card>
  );
}
