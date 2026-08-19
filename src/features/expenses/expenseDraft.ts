import type { CategoryId, Member, ParsedExpense } from "../../types/domain";
import type { ExpenseTab } from "../../stores/useModalStore";

/** Everything the expense sheet is holding while it is open. */
export interface ExpenseDraft {
  tab: ExpenseTab;
  /** Masked, e.g. "1,280,000". Parsed with parseMoneyInput on save. */
  amount: string;
  title: string;
  category: CategoryId;
  payer: Member;
  participants: Member[];
  splitMode: "even" | "custom";
  /** Per-member amounts, only meaningful when splitMode is "custom". */
  custom: Record<Member, number>;
  text: string;
  /** null until the text has been read once. */
  parsed: ParsedExpense[] | null;
}

export const emptyDraft = (tab: ExpenseTab, me: Member, members: Member[]): ExpenseDraft => ({
  tab,
  amount: "",
  title: "",
  category: "food",
  payer: me,
  participants: [...members],
  splitMode: "even",
  custom: {},
  text: "",
  parsed: null,
});

/**
 * Seeds custom amounts from an even split, rounded down to the nearest 1,000
 * with the remainder given to the last person — so the parts always add up.
 */
export function seedCustomSplit(total: number, participants: Member[]): Record<Member, number> {
  const n = participants.length;
  if (!total || !n) return {};

  const base = Math.floor(total / n / 1000) * 1000;
  const custom: Record<Member, number> = {};
  participants.forEach((name, i) => {
    custom[name] = i === n - 1 ? total - base * (n - 1) : base;
  });
  return custom;
}
