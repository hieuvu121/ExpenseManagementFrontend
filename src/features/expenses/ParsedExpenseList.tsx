import { CATEGORIES } from "../../constants/categories";
import type { Highlight, Household, ParsedExpense } from "../../types/domain";
import { cn, NUM } from "../../utils/cn";
import { dmy, MONTHS } from "../../utils/date";
import { vnd } from "../../utils/money";
import { CategoryDot } from "../../components/common/CategoryDot";
import { EmptyState } from "../../components/common/EmptyState";
import { Field } from "../../components/ui/Input";
import { ApprovalNote } from "./ApprovalNote";

const MARK: Record<NonNullable<Highlight["kind"]>, string> = {
  amount: "text-teal-dark border-teal",
  payer: "text-cobalt-text border-cobalt",
  split: "text-rose-text border-rose",
};

interface ParsedExpenseListProps {
  household: Household;
  parsed: ParsedExpense[];
  onDrop: (index: number) => void;
  onEdit: (index: number) => void;
}

/**
 * What the parser made of the text: the original sentences with the words it
 * used underlined, then one card per expense it is proposing to add.
 */
export function ParsedExpenseList({ household, parsed, onDrop, onEdit }: ParsedExpenseListProps) {
  if (!parsed.length) {
    return (
      <EmptyState title="No amount found" className="mt-1.5">
        Try writing the amount clearly, e.g. “groceries 240k, I paid, split evenly”.
      </EmptyState>
    );
  }

  const keeping = parsed.filter((p) => !p.dropped);

  return (
    <>
      <Field label="Here's what it read">
        <div className="rounded-md border border-l-[3px] border-line border-l-cobalt bg-card px-3.5 py-3 text-ui-base leading-[1.85]">
          {parsed.map((expense, i) => (
            <p key={i}>
              {expense.highlights.map((segment, j) =>
                segment.kind ? (
                  <mark
                    key={j}
                    className={cn("border-b-2 bg-transparent pb-0.5 font-medium", MARK[segment.kind])}
                  >
                    {segment.text}
                  </mark>
                ) : (
                  <span key={j}>{segment.text}</span>
                ),
              )}
            </p>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap gap-3.5 text-ui-2xs text-ink-soft">
          <span>
            <i className="mr-1.5 inline-block h-0.5 w-3.5 bg-teal align-middle" />
            amount
          </span>
          <span>
            <i className="mr-1.5 inline-block h-0.5 w-3.5 bg-cobalt align-middle" />
            who paid
          </span>
          <span>
            <i className="mr-1.5 inline-block h-0.5 w-3.5 bg-rose align-middle" />
            split rule
          </span>
        </div>
      </Field>

      <Field label={`${keeping.length} ${keeping.length === 1 ? "expense" : "expenses"} to add`}>
        {parsed.map((expense, index) =>
          expense.dropped ? null : (
            <div
              key={index}
              className="mt-2.5 animate-enter rounded-md border border-line bg-card px-3.5 py-3"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="flex-1 text-ui-base font-semibold">{expense.title}</span>
                <span className={cn(NUM, "text-ui-md font-semibold")}>{vnd(expense.amount)} ₫</span>
              </div>

              <div className="mt-1 text-ui-xs text-ink-soft">
                <CategoryDot category={expense.category} />
                {CATEGORIES[expense.category].label} · {expense.payer} paid · split evenly{" "}
                {expense.participants.length} ways · {MONTHS[expense.date.getMonth()]}{" "}
                {dmy(expense.date)}
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  className="tap inline-flex items-center text-ui-xs font-semibold text-teal-dark hover:underline"
                >
                  Edit or change the split
                </button>
                <button
                  type="button"
                  onClick={() => onDrop(index)}
                  className="tap inline-flex items-center text-ui-xs font-semibold text-rose-text hover:underline"
                >
                  Drop this one
                </button>
              </div>
            </div>
          ),
        )}
      </Field>

      <ApprovalNote household={household} />
    </>
  );
}
