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
        <div className="flex flex-wrap items-center gap-2.5 text-ui-xs text-ink-soft">
          <span className={EYEBROW}>Household</span>
          <span
            className={cn(
              "rounded-[3px] px-1.5 py-0.5 text-ui-2xs font-bold uppercase tracking-[.1em]",
              isAdmin ? "bg-ink text-ink-invert" : "bg-hover text-ink-soft",
            )}
          >
            {isAdmin ? "You're the admin" : `Admin: ${household.admin}`}
          </span>
        </div>

        <h1 className="disp mb-1.5 mt-0.5 font-display text-ui-xl font-bold leading-[1.02] shell:text-ui-2xl">
          {household.name}
        </h1>

        <div className="text-ui-xs text-ink-soft">
          {household.members.length} members · {household.members.join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2.5 rounded-md border border-dashed border-line bg-card px-2.5 py-1.5">
        <span className="text-ui-2xs text-ink-soft">INVITE CODE</span>
        <b className="font-mono text-ui-base font-semibold tracking-code">{household.code}</b>
        <button
          type="button"
          onClick={copyCode}
          className="tap inline-flex items-center text-ui-2xs font-semibold text-teal-dark hover:underline"
        >
          Copy
        </button>
      </div>
    </header>
  );
}
