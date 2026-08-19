import { ME, SETTLED_THRESHOLD } from "../../constants/config";
import type { Household, Member } from "../../types/domain";
import { cn, EYEBROW, NUM } from "../../utils/cn";
import { signed } from "../../utils/money";

interface BalanceSpineProps {
  household: Household;
  net: Record<Member, number>;
}

/**
 * Balances drawn against a centre axis: owed to the left, owing to the right.
 * Bars are scaled against the largest absolute balance, so the shape of the
 * household reads at a glance regardless of the amounts involved.
 */
export function BalanceSpine({ household, net }: BalanceSpineProps) {
  const rows = Object.entries(net).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map(([, value]) => Math.abs(value)));

  return (
    <>
      <div className={cn(EYEBROW, "mb-2.5 flex justify-between text-[10px] tracking-[.1em]")}>
        <span>Owes</span>
        <span>Is owed</span>
      </div>

      {rows.map(([name, value]) => {
        const width = Math.min(100, (Math.abs(value) / max) * 100);
        const owes = value < -SETTLED_THRESHOLD;
        const owed = value > SETTLED_THRESHOLD;

        return (
          <div
            key={name}
            className="grid grid-cols-[64px_1fr_96px] items-center gap-2 py-[5px] shell:grid-cols-[82px_1fr_108px] shell:gap-2.5"
          >
            <div className={cn("truncate text-[13.5px]", name === ME && "font-semibold")}>
              {name}
              {name === household.admin && " ★"}
              {name === ME && (
                <span className="ml-1.5 text-[9.5px] font-semibold uppercase tracking-tag text-ink-muted">
                  you
                </span>
              )}
            </div>

            <div className="flex h-4 items-center">
              <div className="flex h-full flex-1 justify-end">
                {owes && (
                  <span
                    className="block h-full rounded-[1px] bg-rose/[.85] transition-[width] duration-500"
                    style={{ width: `${width}%` }}
                  />
                )}
              </div>
              <div className="h-[26px] w-px flex-none bg-line" />
              <div className="flex h-full flex-1">
                {owed && (
                  <span
                    className="block h-full rounded-[1px] bg-moss/[.85] transition-[width] duration-500"
                    style={{ width: `${width}%` }}
                  />
                )}
              </div>
            </div>

            <div
              className={cn(
                NUM,
                "text-right text-xs font-medium shell:text-[13px]",
                owed ? "text-moss" : owes ? "text-rose" : "text-ink-muted",
              )}
            >
              {Math.abs(value) < SETTLED_THRESHOLD ? "0" : signed(value)}
            </div>
          </div>
        );
      })}
    </>
  );
}
