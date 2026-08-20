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
import { ManualExpenseForm, type ManualErrors } from "./ManualExpenseForm";
import { PasteTextForm } from "./PasteTextForm";
import { emptyDraft, type ExpenseDraft } from "./expenseDraft";

const TABS: { id: ExpenseTab; label: string }[] = [
  { id: "manual", label: "Manual" },
  { id: "ai", label: "Paste text" },
];

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
  const [errors, setErrors] = useState<ManualErrors>({});

  if (!household) return null;

  const patch = (changes: Partial<ExpenseDraft>) => {
    setDraft((d) => ({ ...d, ...changes }));
    // Clear a field's error the moment the user starts fixing it, rather than
    // leaving it accusing them until they submit again.
    setErrors((e) => {
      const next = { ...e };
      if (changes.amount !== undefined) delete next.amount;
      if (changes.participants !== undefined) delete next.participants;
      return next;
    });
  };
  const isAdmin = household.admin === ME;
  const status: Expense["status"] = isAdmin ? "accepted" : "pending";

  const saveManual = () => {
    const amount = parseMoneyInput(draft.amount);
    const title = draft.title.trim() || "Expense";

    // Collect every problem at once — reporting them one at a time makes the
    // user submit repeatedly to discover what else is wrong.
    const found: ManualErrors = {};
    if (!amount) found.amount = "Enter how much it cost.";
    if (!draft.participants.length) found.participants = "Pick at least one person to split with.";
    if (amount && draft.splitMode === "custom") {
      const sum = draft.participants.reduce((s, name) => s + (draft.custom[name] ?? 0), 0);
      if (sum !== amount) found.amount = `The parts have to add up to ${vnd(amount)} ₫.`;
    }

    if (Object.keys(found).length) {
      setErrors(found);
      if (found.amount) document.getElementById("expense-amount")?.focus();
      return;
    }

    let custom: Record<string, number> | null = null;
    if (draft.splitMode === "custom") {
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

  /** Left/Right cycle the tablist, as the ARIA tabs pattern requires. */
  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = TABS[(TABS.findIndex((t) => t.id === draft.tab) + 1) % TABS.length];
    patch({ tab: next.id });
    document.getElementById(`expense-tab-${next.id}`)?.focus();
  };

  const keepingCount = (draft.parsed ?? []).filter((p) => !p.dropped).length;

  const footer =
    draft.tab === "manual" ? (
      <>
        <Button onClick={close}>Cancel</Button>
        <Button variant="primary" onClick={saveManual}>
          {isAdmin ? "Save & approve" : "Send for approval"}
        </Button>
      </>
    ) : draft.parsed?.length ? (
      <>
        <Button onClick={close}>Cancel</Button>
        <Button variant="primary" onClick={saveParsed} disabled={!keepingCount}>
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
          <div
            role="tablist"
            aria-label="How to add the expense"
            className="mx-5 flex gap-1 rounded-md bg-hover p-0.5"
          >
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                id={`expense-tab-${id}`}
                role="tab"
                type="button"
                aria-selected={draft.tab === id}
                aria-controls={`expense-panel-${id}`}
                // Roving tabindex: the tablist is one Tab stop, and Left/Right
                // move between the tabs inside it.
                tabIndex={draft.tab === id ? 0 : -1}
                onKeyDown={onTabKey}
                onClick={() => patch({ tab: id })}
                className={cn(
                  "tap flex-1 rounded p-2 text-ui-sm font-semibold transition-colors duration-quick ease-standard",
                  draft.tab === id ? "bg-card text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <div
        id={`expense-panel-${draft.tab}`}
        role="tabpanel"
        aria-labelledby={`expense-tab-${draft.tab}`}
      >
        {draft.tab === "manual" ? (
          <ManualExpenseForm household={household} draft={draft} patch={patch} errors={errors} />
        ) : (
          <PasteTextForm
            household={household}
            draft={draft}
            patch={patch}
            onParse={() => patch({ parsed: parseExpenseText(draft.text, household) })}
            onEdit={editParsed}
          />
        )}
      </div>
    </Sheet>
  );
}
