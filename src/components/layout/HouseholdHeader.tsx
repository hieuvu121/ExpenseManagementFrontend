import { ME } from "../../constants/config";
import type { Household } from "../../types/domain";
import { useToast } from "../../hooks/useToast";
import { cn, EYEBROW } from "../../utils/cn";

export function HouseholdHeader({ household }: { household: Household }) {
  const toast = useToast();
  const isAdmin = household.admin === ME;

  const copyCode = async () => {
    await navigator.clipboard?.writeText(household.code);
    toast(`Copied invite code ${household.code}`);
  };

  return (
    <header className="flex flex-wrap items-start gap-4 pb-3.5">
      <div className="min-w-[230px] flex-1">
        <div className="flex flex-wrap items-center gap-2.5 text-[12.5px] text-ink-soft">
          <span className={EYEBROW}>Household</span>
          <span
            className={cn(
              "rounded-[3px] px-[7px] py-[3px] text-[11px] font-bold uppercase tracking-[.1em]",
              isAdmin ? "bg-ink text-ink-invert" : "bg-hover text-ink-soft",
            )}
          >
            {isAdmin ? "You're the admin" : `Admin: ${household.admin}`}
          </span>
        </div>

        <h1 className="disp mb-1.5 mt-[3px] font-display text-[27px] font-bold leading-[1.02] shell:text-[34px]">
          {household.name}
        </h1>

        <div className="text-[12.5px] text-ink-soft">
          {household.members.length} members · {household.members.join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-md border border-dashed border-line bg-card px-2.5 py-1.5">
        <span className="text-[11px] text-ink-soft">INVITE CODE</span>
        <b className="font-mono text-sm font-semibold tracking-code">{household.code}</b>
        <button
          type="button"
          onClick={copyCode}
          className="tap inline-flex items-center text-[11.5px] font-semibold text-teal-dark hover:underline"
        >
          Copy
        </button>
      </div>
    </header>
  );
}
