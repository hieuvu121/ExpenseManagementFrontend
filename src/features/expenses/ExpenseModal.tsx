import { useState } from "react";
import { ME } from "../../constants/config";
import { useActiveHousehold } from "../../hooks/useActiveHousehold";
import { useToast } from "../../hooks/useToast";
import { makeExpense } from "../../services/mockData";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import { useModalStore, type ExpenseTab } from "../../stores/useModalStore";
import type { Expense } from "../../types/domain";
import { cn } from "../../utils/cn";
import { parseMoneyInput, vnd } from "../../utils/money";
import { parseExpenseText } from "../../utils/parseExpenseText";
import { Button } from "../../components/ui/Button";
import { Sheet } from "../../components/ui/Sheet";
import { ManualExpenseForm } from "./ManualExpenseForm";
import { PasteTextForm } from "./PasteTextForm";
import { emptyDraft, type ExpenseDraft } from "./expenseDraft";

/**
 * The two-tab add-expense sheet. Draft state is local rather than in a store:
 * it exists only while the sheet is open, and closing it should discard it.
 */
export function ExpenseModal() {
  const household = useActiveHousehold();
  const openTab = useModalStore((s) => s.expenseTab);
  const close = useModalStore((s) => s.close);
  const addExpenses = useHouseholdStore((s) => s.addExpenses);
  const toast = useToast();

  const [draft, setDraft] = useState<ExpenseDraft>(() =>
    emptyDraft(openTab, ME, household?.members ?? []),
  );

  if (!household) return null;

  const patch = (changes: Partial<ExpenseDraft>) => setDraft((d) => ({ ...d, ...changes }));
  const isAdmin = household.admin === ME;
  const status: Expense["status"] = isAdmin ? "accepted" : "pending";

  const saveManual = () => {
    const amount = parseMoneyInput(draft.amount);
    const title = draft.title.trim() || "Expense";

    if (!amount) return toast("Enter an amount first");
    if (!draft.participants.length) return toast("Pick at least one person to split with");

    let custom: Record<string, number> | null = null;
    if (draft.splitMode === "custom") {
      const sum = draft.participants.reduce((s, name) => s + (draft.custom[name] ?? 0), 0);
      if (sum !== amount) return toast(`The parts have to add up to ${vnd(amount)} ₫`);
      custom = Object.fromEntries(draft.participants.map((n) => [n, draft.custom[n] ?? 0]));
    }

    addExpenses([
      makeExpense(title, amount, draft.payer, [...draft.participants], new Date(), {
        category: draft.category,
        custom,
        addedBy: ME,
        status,
      }),
    ]);

    close();
    toast(
      isAdmin
        ? `Added and approved “${title}”`
        : `Sent “${title}” to ${household.admin} for approval`,
    );
  };

  const saveParsed = () => {
    const keeping = (draft.parsed ?? []).filter((p) => !p.dropped);

    addExpenses(
      keeping.map((p) =>
        makeExpense(p.title, p.amount, p.payer, p.participants, p.date, {
          category: p.category,
          source: "ai",
          addedBy: ME,
          status,
        }),
      ),
    );

    close();
    toast(
      isAdmin
        ? `Added ${keeping.length} expenses`
        : `Sent ${keeping.length} to ${household.admin} for approval`,
    );
  };

  /** "Edit or change the split" moves one parsed expense into the manual tab. */
  const editParsed = (index: number) => {
    const picked = draft.parsed?.[index];
    if (!picked) return;
    patch({
      tab: "manual",
      amount: vnd(picked.amount),
      title: picked.title,
      category: picked.category,
      payer: picked.payer,
      participants: [...picked.participants],
      splitMode: "even",
      custom: {},
    });
  };

  const keepingCount = (draft.parsed ?? []).filter((p) => !p.dropped).length;

  const footer =
    draft.tab === "manual" ? (
      <>
        <Button onClick={close}>Cancel</Button>
        <Button variant="teal" onClick={saveManual}>
          {isAdmin ? "Save & approve" : "Send for approval"}
        </Button>
      </>
    ) : draft.parsed?.length ? (
      <>
        <Button onClick={close}>Cancel</Button>
        <Button variant="teal" onClick={saveParsed} disabled={!keepingCount}>
          Add {keepingCount} {keepingCount === 1 ? "expense" : "expenses"}
        </Button>
      </>
    ) : undefined;

  return (
    <Sheet
      title="Add an expense"
      onClose={close}
      footer={footer}
      belowHeader={
        <div className="pt-3">
          <div className="mx-5 flex gap-1 rounded-md bg-hover p-[3px]" role="tablist">
            {(["manual", "ai"] as ExpenseTab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={draft.tab === tab}
                onClick={() => patch({ tab })}
                className={cn(
                  "flex-1 rounded p-2 text-[13.5px] font-semibold transition-colors",
                  draft.tab === tab ? "bg-card text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {tab === "manual" ? "Manual" : "Paste text"}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {draft.tab === "manual" ? (
        <ManualExpenseForm household={household} draft={draft} patch={patch} />
      ) : (
        <PasteTextForm
          household={household}
          draft={draft}
          patch={patch}
          onParse={() => patch({ parsed: parseExpenseText(draft.text, household) })}
          onEdit={editParsed}
        />
      )}
    </Sheet>
  );
}
