import { PAGE_SIZE } from "../../constants/config";
import { useCursorPagination } from "../../hooks/useCursorPagination";
import { useToast } from "../../hooks/useToast";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import type { Settlement } from "../../types/domain";
import { cn, EYEBROW, NUM } from "../../utils/cn";
import { settlementCursor } from "../../utils/cursor";
import { vnd } from "../../utils/money";
import { Pager } from "../../components/common/Pager";

interface SettlementListProps {
  householdId: string;
  settlements: Settlement[];
}

/** The suggested payments that clear the household in the fewest transfers. */
export function SettlementList({ householdId, settlements }: SettlementListProps) {
  const recordSettlement = useHouseholdStore((s) => s.recordSettlement);
  const toast = useToast();

  const pagination = useCursorPagination(
    settlements,
    settlementCursor,
    PAGE_SIZE.debts,
    householdId,
  );

  if (!settlements.length) {
    return (
      <div className="mt-3.5 border-t border-line-soft pt-3 text-[13px] text-ink-soft">
        Nobody owes anybody.
      </div>
    );
  }

  return (
    <div className="mt-3.5 border-t border-line-soft pt-3">
      <div className={cn(EYEBROW, "mb-1.5")}>Settle up like this</div>

      {pagination.visible.map((settlement) => (
        <div
          key={`${settlement.from}>${settlement.to}`}
          className="flex items-center gap-2.5 border-b border-line-soft py-2 text-[13.5px]"
        >
          <span>{settlement.from}</span>
          <span className="text-ink-soft">→</span>
          <span>{settlement.to}</span>
          <span className={cn(NUM, "ml-auto font-medium")}>{vnd(settlement.amount)} ₫</span>
          <button
            type="button"
            onClick={() => {
              recordSettlement(settlement);
              toast("Payment recorded");
            }}
            className="tap inline-flex items-center justify-center rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-teal-dark hover:border-teal"
          >
            Mark paid
          </button>
        </div>
      ))}

      <Pager pagination={pagination} pageSize={PAGE_SIZE.debts} skeletonColumns="1fr 90px" />
    </div>
  );
}
