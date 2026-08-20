import { useState } from "react";
import { CATEGORIES } from "../../constants/categories";
import { DURATION } from "../../constants/motion";
import { ME } from "../../constants/config";
import { useToast } from "../../hooks/useToast";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import type { Expense, Household } from "../../types/domain";
import { byNewest, pendingExpenses, shareOf } from "../../utils/balances";
import { cn, NUM } from "../../utils/cn";
import { dmy, MONTHS } from "../../utils/date";
import { vnd } from "../../utils/money";
import { Card, CardHeader } from "../../components/ui/Card";
import { EmptyState } from "../../components/common/EmptyState";
import { Pill } from "../../components/ui/Pill";
import { Tag } from "../../components/ui/Tag";

/**
 * The approval queue. Approving is the only thing that puts an expense into the
 * ledger, so this sits at the top of the dashboard.
 */
export function PendingExpenses({ household }: { household: Household }) {
  const approve = useHouseholdStore((s) => s.approve);
  const decline = useHouseholdStore((s) => s.decline);
  const withdraw = useHouseholdStore((s) => s.withdraw);
  const restore = useHouseholdStore((s) => s.restore);
  const addExpenses = useHouseholdStore((s) => s.addExpenses);
  const toast = useToast();

  const [exitingId, setExitingId] = useState<number | null>(null);

  /**
   * Animate first, then mutate. The row has to still be in the list while it
   * folds away, so the store call waits until the animation is done — approving
   * is what removes it from `pendingExpenses()`.
   */
  const runExit = (id: number, action: () => void) => {
    if (exitingId !== null) return; // one at a time; avoids a half-finished fold
    setExitingId(id);
    setTimeout(() => {
      action();
      setExitingId(null);
    }, DURATION.base);
  };

  const isAdmin = household.admin === ME;
  const pending = pendingExpenses(household).sort(byNewest);

  return (
    <Card>
      <CardHeader
        title="Pending expenses"
        subtitle={
          isAdmin
            ? "You're the admin — approving is what puts an expense into the ledger."
            : `Admin ${household.admin} will review these.`
        }
        action={
          pending.length ? (
            <Pill tone="pending">{pending.length} pending</Pill>
          ) : undefined
        }
      />

      {pending.length === 0 ? (
        <EmptyState title="Nothing pending" variant="bare">
          Every expense has been reviewed.
        </EmptyState>
      ) : (
        pending.map((expense, i) => (
          <PendingRow
            key={expense.id}
            expense={expense}
            first={i === 0}
            isAdmin={isAdmin}
            // Every one of these is someone else's money and none of them
            // asked for confirmation. A confirm dialog trains people to click
            // through it; an undo actually gets used.
            exiting={exitingId === expense.id}
            onApprove={() =>
              runExit(expense.id, () => {
                approve(expense.id);
                toast(`Approved “${expense.title}”`, {
                  label: "Undo",
                  onClick: () => restore(expense.id),
                });
              })
            }
            onDecline={() =>
              runExit(expense.id, () => {
                decline(expense.id);
                toast(`Declined “${expense.title}”`, {
                  label: "Undo",
                  onClick: () => restore(expense.id),
                });
              })
            }
            onWithdraw={() =>
              runExit(expense.id, () => {
                // withdraw deletes the row, so undo has to put the object back.
                const removed = expense;
                withdraw(expense.id);
                toast("Expense withdrawn", {
                  label: "Undo",
                  onClick: () => addExpenses([removed]),
                });
              })
            }
          />
        ))
      )}
    </Card>
  );
}

interface PendingRowProps {
  expense: Expense;
  first: boolean;
  isAdmin: boolean;
  exiting: boolean;
  onApprove: () => void;
  onDecline: () => void;
  onWithdraw: () => void;
}

function PendingRow({
  expense,
  first,
  isAdmin,
  exiting,
  onApprove,
  onDecline,
  onWithdraw,
}: PendingRowProps) {
  const mine = expense.participants.includes(ME) ? shareOf(expense, ME) : 0;

  return (
    // Outer element collapses, inner element clips: `0fr` only hides anything if
    // the grid child has overflow hidden.
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-base ease-exit",
        exiting ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
        !first && "border-t border-line-soft",
      )}
    >
      <div className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-2.5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-ui-base font-medium">
              {expense.title}
              <Pill tone="pending">
                {expense.addedBy === ME
                  ? "added by you"
                  : `added by ${expense.addedBy}`}
              </Pill>
              {expense.source === "ai" && <Tag tone="ai">AI</Tag>}
              {expense.custom && <Tag tone="custom">custom split</Tag>}
            </div>
            <div className="mt-0.5 text-ui-xs text-ink-soft">
              {expense.payer} paid · {CATEGORIES[expense.category].label} ·
              split {expense.participants.length} ways ·{" "}
              {MONTHS[expense.date.getMonth()]} {dmy(expense.date)}
              {mine > 0 && (
                <>
                  {" "}
                  · your share <b className={NUM}>{vnd(mine)}</b>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={cn(NUM, "text-ui-base font-semibold")}>
              {vnd(expense.amount)} ₫
            </span>
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  className="tap inline-flex items-center justify-center rounded-full border border-moss px-3.5 py-1 text-ui-xs font-semibold text-moss-text hover:bg-moss hover:text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={onDecline}
                  className="tap inline-flex items-center justify-center rounded-full border border-line px-3.5 py-1 text-ui-xs font-semibold text-ink-soft hover:border-rose hover:text-rose-text"
                >
                  Decline
                </button>
              </>
            ) : expense.addedBy === ME ? (
              <button
                type="button"
                onClick={onWithdraw}
                className="tap inline-flex items-center justify-center rounded-full border border-line px-3.5 py-1 text-ui-xs font-semibold text-ink-soft hover:border-rose hover:text-rose-text"
              >
                Withdraw
              </button>
            ) : (
              <span className="text-ui-xs font-semibold text-gold-text">
                Waiting
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
