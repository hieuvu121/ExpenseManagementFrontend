import { ME, SETTLED_THRESHOLD } from "../../constants/config";
import type { Household } from "../../types/domain";
import { isLive, netFor, pendingExpenses, shareOf } from "../../utils/balances";
import { sameMonth, TODAY } from "../../utils/date";
import { cn, EYEBROW, NUM } from "../../utils/cn";
import { signed, vnd } from "../../utils/money";

interface TileProps {
  label: string;
  value: string;
  hint: string;
  tone?: string;
}

function Tile({ label, value, hint, tone }: TileProps) {
  return (
    <div className="rounded-md border border-line bg-card px-3.5 py-[13px]">
      <div className={EYEBROW}>{label}</div>
      <div className={cn(NUM, "mt-[5px] text-[23px] font-semibold", tone)}>{value}</div>
      <div className="mt-0.5 text-[11.5px] text-ink-soft">{hint}</div>
    </div>
  );
}

export function SummaryTiles({ household }: { household: Household }) {
  const thisMonth = household.expenses.filter((e) => isLive(e) && sameMonth(e.date, TODAY));
  const spent = thisMonth.reduce((sum, e) => sum + e.amount, 0);
  const mine = thisMonth.reduce(
    (sum, e) => sum + (e.participants.includes(ME) ? shareOf(e, ME) : 0),
    0,
  );
  const net = netFor(household, ME);
  const pending = pendingExpenses(household);
  const pendingSum = pending.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] gap-2.5">
      <Tile
        label="Spent this month"
        value={vnd(spent)}
        hint={`whole house, ${thisMonth.length} approved`}
      />
      <Tile
        label="Your share"
        value={vnd(mine)}
        hint={`${spent ? Math.round((mine / spent) * 100) : 0}% of the total`}
      />
      <Tile
        label="Your balance"
        value={Math.abs(net) < SETTLED_THRESHOLD ? "0" : signed(net)}
        tone={net > SETTLED_THRESHOLD ? "text-moss-text" : net < -SETTLED_THRESHOLD ? "text-rose-text" : ""}
        hint={
          net > SETTLED_THRESHOLD
            ? "the house owes you"
            : net < -SETTLED_THRESHOLD
              ? "you owe the house"
              : "nobody owes anybody"
        }
      />
      <Tile
        label="Awaiting approval"
        value={String(pending.length)}
        tone="text-gold-text"
        hint={pending.length ? `${vnd(pendingSum)} ₫ not in the ledger` : "nothing left to review"}
      />
    </div>
  );
}
