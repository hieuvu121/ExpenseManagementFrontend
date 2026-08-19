import { CATEGORIES } from "../../constants/categories";
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
  const toast = useToast();

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
        action={pending.length ? <Pill tone="pending">{pending.length} pending</Pill> : undefined}
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
            onApprove={() => {
              approve(expense.id);
              toast(`Approved “${expense.title}”`);
            }}
            onDecline={() => {
              decline(expense.id);
              toast(`Declined “${expense.title}”`);
            }}
            onWithdraw={() => {
              withdraw(expense.id);
              toast("Expense withdrawn");
            }}
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
  onApprove: () => void;
  onDecline: () => void;
  onWithdraw: () => void;
}

function PendingRow({ expense, first, isAdmin, onApprove, onDecline, onWithdraw }: PendingRowProps) {
  const mine = expense.participants.includes(ME) ? shareOf(expense, ME) : 0;

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto] items-center gap-3 py-[11px]",
        !first && "border-t border-line-soft",
      )}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[14.5px] font-medium">
          {expense.title}
          <Pill tone="pending">
            {expense.addedBy === ME ? "added by you" : `added by ${expense.addedBy}`}
          </Pill>
          {expense.source === "ai" && <Tag tone="ai">AI</Tag>}
          {expense.custom && <Tag tone="custom">custom split</Tag>}
        </div>
        <div className="mt-0.5 text-xs text-ink-soft">
          {expense.payer} paid · {CATEGORIES[expense.category].label} · split{" "}
          {expense.participants.length} ways · {MONTHS[expense.date.getMonth()]} {dmy(expense.date)}
          {mine > 0 && (
            <>
              {" "}
              · your share <b className={NUM}>{vnd(mine)}</b>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={cn(NUM, "text-[15px] font-semibold")}>{vnd(expense.amount)} ₫</span>
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={onApprove}
              className="rounded-full border border-moss px-[11px] py-[5px] text-[12.5px] font-semibold text-moss hover:bg-moss hover:text-white"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="rounded-full border border-line px-[11px] py-[5px] text-[12.5px] font-semibold text-ink-soft hover:border-rose hover:text-rose"
            >
              Decline
            </button>
          </>
        ) : expense.addedBy === ME ? (
          <button
            type="button"
            onClick={onWithdraw}
            className="rounded-full border border-line px-[11px] py-[5px] text-[12.5px] font-semibold text-ink-soft hover:border-rose hover:text-rose"
          >
            Withdraw
          </button>
        ) : (
          <span className="text-xs font-semibold text-gold">Waiting</span>
        )}
      </div>
    </div>
  );
}
