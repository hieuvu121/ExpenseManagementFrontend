import { CATEGORY_LIST } from "../../constants/categories";
import { ME } from "../../constants/config";
import type { Household } from "../../types/domain";
import { cn, NUM } from "../../utils/cn";
import { parseMoneyInput, vnd } from "../../utils/money";
import { CategoryDot } from "../../components/common/CategoryDot";
import { Chip } from "../../components/ui/Chip";
import { Field, Input } from "../../components/ui/Input";
import { MoneyInput } from "../../components/ui/MoneyInput";
import { ApprovalNote } from "./ApprovalNote";
import { seedCustomSplit, type ExpenseDraft } from "./expenseDraft";

interface ManualExpenseFormProps {
  household: Household;
  draft: ExpenseDraft;
  patch: (changes: Partial<ExpenseDraft>) => void;
}

export function ManualExpenseForm({ household, draft, patch }: ManualExpenseFormProps) {
  const total = parseMoneyInput(draft.amount);
  const customSum = draft.participants.reduce((sum, name) => sum + (draft.custom[name] ?? 0), 0);
  const difference = total - customSum;
  const allSelected = draft.participants.length === household.members.length;

  const toggleParticipant = (name: string) => {
    if (draft.participants.includes(name)) {
      // Dropping someone from the split also drops their custom amount, or it
      // would keep counting toward the total.
      const custom = Object.fromEntries(
        Object.entries(draft.custom).filter(([member]) => member !== name),
      );
      patch({ participants: draft.participants.filter((p) => p !== name), custom });
    } else {
      patch({ participants: [...draft.participants, name] });
    }
  };

  return (
    <>
      <Field label="Amount" htmlFor="expense-amount">
        <MoneyInput
          id="expense-amount"
          value={draft.amount}
          onChange={(amount) => patch({ amount })}
        />
      </Field>

      <Field label="What was it for" htmlFor="expense-title">
        <Input
          id="expense-title"
          autoComplete="off"
          placeholder="Groceries, electricity, dinner…"
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
        />
      </Field>

      <Field label="Category">
        <div role="radiogroup" aria-label="Category" className="flex flex-wrap gap-1.5">
          {CATEGORY_LIST.map((category) => (
            <Chip
              key={category.id}
              select="radio"
              pressed={draft.category === category.id}
              onClick={() => patch({ category: category.id })}
            >
              <CategoryDot category={category.id} />
              {category.label}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Who paid">
        <div role="radiogroup" aria-label="Who paid" className="flex flex-wrap gap-1.5">
          {household.members.map((member) => (
            <Chip
              key={member}
              tone="teal"
              select="radio"
              pressed={draft.payer === member}
              onClick={() => patch({ payer: member })}
            >
              {member}
              {member === ME && " (you)"}
            </Chip>
          ))}
        </div>
      </Field>

      <Field
        label="Split between"
        aside={
          <button
            type="button"
            onClick={() => patch({ participants: allSelected ? [] : [...household.members] })}
            className="tap inline-flex items-center text-xs font-semibold text-teal-dark hover:underline"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        }
      >
        <div role="group" aria-label="Split between" className="flex flex-wrap gap-1.5">
          {household.members.map((member) => (
            <Chip
              key={member}
              pressed={draft.participants.includes(member)}
              onClick={() => toggleParticipant(member)}
            >
              {member}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="How to split">
        <div role="radiogroup" aria-label="How to split" className="flex flex-wrap gap-1.5">
          <Chip
            tone="teal"
            select="radio"
            pressed={draft.splitMode === "even"}
            onClick={() => patch({ splitMode: "even" })}
          >
            Evenly
          </Chip>
          <Chip
            tone="teal"
            select="radio"
            pressed={draft.splitMode === "custom"}
            onClick={() =>
              patch({
                splitMode: "custom",
                custom: seedCustomSplit(total, draft.participants),
              })
            }
          >
            Custom amounts
          </Chip>
        </div>

        {draft.splitMode === "even" ? (
          <div className="mt-1.5 text-xs text-ink-soft">
            {draft.participants.length && total ? (
              <>
                <b className={NUM}>{vnd(total / draft.participants.length)} ₫</b> each
              </>
            ) : (
              "—"
            )}{" "}
            · {draft.participants.length}{" "}
            {draft.participants.length === 1 ? "person" : "people"}.
          </div>
        ) : (
          <div className="mt-2.5">
            {draft.participants.map((name) => (
              <div
                key={name}
                className="flex items-center gap-2.5 border-b border-line-soft py-[7px] text-[13.5px]"
              >
                <span className="flex-1">
                  {name}
                  {name === ME && " (you)"}
                </span>
                <MoneyInput
                  size="small"
                  value={draft.custom[name] ? vnd(draft.custom[name]) : ""}
                  onChange={(masked) =>
                    patch({ custom: { ...draft.custom, [name]: parseMoneyInput(masked) } })
                  }
                />
              </div>
            ))}

            <div
              className={cn(
                "mt-2 text-[12.5px] font-semibold",
                difference === 0 && total ? "text-moss-text" : "text-rose-text",
              )}
            >
              {!total
                ? "Enter the amount first."
                : difference === 0
                  ? `Matches ${vnd(total)} ₫`
                  : difference > 0
                    ? `Short by ${vnd(difference)} ₫`
                    : `Over by ${vnd(-difference)} ₫`}
            </div>
            <div className="mt-1.5 text-xs text-ink-soft">
              For a 30/30/40 split, type the amounts directly — the total has to match.
            </div>
          </div>
        )}
      </Field>

      <ApprovalNote household={household} />
    </>
  );
}
