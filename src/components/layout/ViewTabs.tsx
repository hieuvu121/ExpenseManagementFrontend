import { NavLink } from "react-router";
import { useModalStore } from "../../stores/useModalStore";
import { Button } from "../ui/Button";
import { cn } from "../../utils/cn";

const TABS = [
  { to: "dashboard", label: "Dashboard" },
  { to: "ledger", label: "Balances & expenses" },
];

export function ViewTabs({ householdId }: { householdId: string }) {
  const openModal = useModalStore((s) => s.open);

  return (
    <nav className="mb-[22px] flex items-end gap-[22px] border-b-2 border-ink">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={`/households/${householdId}/${tab.to}`}
          className={({ isActive }) =>
            cn(
              "-mb-0.5 border-b-2 pb-2.5 text-sm font-semibold",
              isActive ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink",
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}

      <span className="flex-1" />

      <div className="mb-2 hidden gap-2 shell:flex">
        <Button onClick={() => openModal("expense", "manual")}>Add manually</Button>
        <Button variant="primary" onClick={() => openModal("expense", "ai")}>
          Paste text
        </Button>
      </div>
    </nav>
  );
}
