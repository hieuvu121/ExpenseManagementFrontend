import { NavLink } from "react-router";
import { ME } from "../../constants/config";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import { useModalStore } from "../../stores/useModalStore";
import { netFor, pendingExpenses } from "../../utils/balances";
import { cn, EYEBROW, NUM } from "../../utils/cn";
import { signed } from "../../utils/money";
import { SETTLED_THRESHOLD } from "../../constants/config";

export function Sidebar() {
  const households = useHouseholdStore((s) => s.households);
  const openModal = useModalStore((s) => s.open);

  const total = households.reduce((sum, h) => sum + netFor(h, ME), 0);

  return (
    <aside
      className={cn(
        "border-b border-line px-4 pb-3 pt-4",
        "shell:sticky shell:top-0 shell:h-screen shell:overflow-auto shell:border-b-0 shell:border-r",
        "shell:px-[18px] shell:pb-[90px] shell:pt-[22px]",
      )}
    >
      <div className="mb-[22px] flex items-baseline gap-2">
        <b className="disp-narrow font-display text-[21px] font-extrabold">Housemate</b>
        <span className="text-[11px] text-ink-soft">shared household expenses</span>
      </div>

      <div className="mb-[22px] rounded-md border border-line bg-card px-[13px] py-3">
        <div className={EYEBROW}>Your balance</div>
        <div
          className={cn(
            NUM,
            "mt-[3px] text-[25px] font-semibold",
            total > 0 ? "text-moss-text" : total < 0 ? "text-rose-text" : "",
          )}
        >
          {signed(total)} ₫
        </div>
        <div className="text-[11.5px] text-ink-soft">
          {total > SETTLED_THRESHOLD
            ? "the house owes you"
            : total < -SETTLED_THRESHOLD
              ? "you owe the house"
              : "all settled up"}
        </div>
      </div>

      <div className={cn(EYEBROW, "mb-2")}>Your households</div>

      <nav className="mb-2 flex gap-1.5 overflow-auto pb-1 shell:flex-col shell:gap-px shell:overflow-visible shell:pb-0">
        {households.map((household) => {
          const net = netFor(household, ME);
          const pending = pendingExpenses(household).length;
          return (
            <NavLink
              key={household.id}
              to={`/households/${household.id}/dashboard`}
              className={({ isActive }) =>
                cn(
                  "flex flex-none items-center gap-2.5 rounded-md p-2.5 text-sm",
                  "border border-line bg-card shell:w-full shell:flex-1 shell:border-0 shell:bg-transparent",
                  // The selected state has to read at every width — without the
                  // unprefixed classes the mobile scroller gave no "you are here".
                  isActive
                    ? "border-ink bg-ink text-ink-invert shell:bg-ink shell:text-ink-invert"
                    : "text-ink-soft hover:bg-hover",
                )
              }
            >
              <span className="flex-1 truncate">{household.name}</span>
              {pending > 0 && (
                <span className="grid h-[17px] min-w-[17px] place-items-center rounded-full bg-gold-text px-1 text-[11px] font-bold text-white">
                  {pending}
                </span>
              )}
              <span className={cn(NUM, "hidden text-[11.5px] opacity-75 shell:inline")}>
                {Math.abs(net) < SETTLED_THRESHOLD ? "—" : signed(net)}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="my-4 hidden h-px bg-line shell:block" />

      {/* Two buttons side by side on a phone, a stacked list on the desktop
          shell. Previously desktop-only, which left mobile with no way in. */}
      <div className="mt-3 grid grid-cols-2 gap-2 shell:mt-0 shell:block shell:gap-0">
        <SidebarLink onClick={() => openModal("create")}>+&nbsp;&nbsp;Create a household</SidebarLink>
        <SidebarLink onClick={() => openModal("join")}>⌗&nbsp;&nbsp;Join with a code</SidebarLink>
      </div>
    </aside>
  );
}

function SidebarLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full rounded-md px-2.5 py-[7px] text-[13.5px] text-ink-soft hover:bg-hover hover:text-ink",
        "border border-line bg-card text-center",
        "shell:border-0 shell:bg-transparent shell:text-left",
      )}
    >
      {children}
    </button>
  );
}
