import { ME, PAGE_SIZE } from "../../constants/config";
import { useCursorPagination } from "../../hooks/useCursorPagination";
import type { Household } from "../../types/domain";
import { byNewest, shareOf } from "../../utils/balances";
import { cn, EYEBROW, NUM } from "../../utils/cn";
import { expenseCursor } from "../../utils/cursor";
import { dmy, MONTHS } from "../../utils/date";
import { vnd } from "../../utils/money";
import { CategoryDot } from "../../components/common/CategoryDot";
import { EmptyState } from "../../components/common/EmptyState";
import { Pager } from "../../components/common/Pager";
import { StatusPill } from "../../components/common/StatusPill";
import { Tag } from "../../components/ui/Tag";

/** Every expense in the household, newest first, dated down the left. */
export function ExpenseFeed({ household }: { household: Household }) {
  const sorted = [...household.expenses].sort(byNewest);
  const pagination = useCursorPagination(sorted, expenseCursor, PAGE_SIZE.expenses, household.id);

  if (!household.expenses.length) {
    return (
      <EmptyState title="No expenses yet">
        Paste a message from the group chat, or add the first one by hand.
      </EmptyState>
    );
  }

  return (
    <>
      <div className={cn(EYEBROW, "mb-3")}>All expenses · {household.expenses.length}</div>

      <div className="border-t border-line">
        {pagination.visible.map((expense) => {
          const mine = expense.participants.includes(ME) ? shareOf(expense, ME) : 0;

          return (
            <div
              key={expense.id}
              className={cn(
                "animate-enter grid grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-line-soft px-1 py-3",
                expense.status !== "accepted" && "opacity-55",
              )}
            >
              <div className="text-center leading-[1.1]">
                <div className={cn(NUM, "text-ui-base font-semibold")}>{dmy(expense.date)}</div>
                <div className="text-ui-2xs uppercase tracking-tag text-ink-soft">
                  {MONTHS[expense.date.getMonth()]}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-1.5 text-ui-base font-medium">
                  {expense.title}
                  {expense.status !== "accepted" && <StatusPill status={expense.status} />}
                  {expense.source === "ai" && <Tag tone="ai">AI</Tag>}
                  {expense.custom && <Tag tone="custom">custom</Tag>}
                  {expense.kind === "settlement" && <Tag tone="settle">settle up</Tag>}
                </div>
                <div className="mt-px text-ui-xs text-ink-soft">
                  <CategoryDot category={expense.category} />
                  {expense.payer} paid · split {expense.participants.length} ways
                </div>
              </div>

              <div className="text-right">
                <div className={cn(NUM, "text-ui-base font-semibold")}>
                  {vnd(expense.amount)} ₫
                </div>
                <div className={cn(NUM, "text-ui-2xs text-ink-soft")}>
                  {mine ? `your share ${vnd(mine)}` : "not your split"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pager
        pagination={pagination}
        pageSize={PAGE_SIZE.expenses}
        skeletonColumns="1fr 130px 90px"
      />
    </>
  );
}
