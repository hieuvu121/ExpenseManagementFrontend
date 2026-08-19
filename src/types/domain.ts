/** Domain model for the Housemate UI. Mirrors the prototype's plain objects. */

export type Member = string;

export type CategoryId = "food" | "market" | "bill" | "home" | "move" | "other";

/** An expense only affects balances once it is `accepted`. */
export type ExpenseStatus = "pending" | "accepted" | "declined";

/** Whether the expense was typed in by hand or read out of pasted text. */
export type ExpenseSource = "manual" | "ai";

export interface Expense {
  id: number;
  title: string;
  amount: number;
  payer: Member;
  /** Who the cost is split between. */
  participants: Member[];
  date: Date;
  source: ExpenseSource;
  category: CategoryId;
  status: ExpenseStatus;
  /** Who entered it — not necessarily who paid. */
  addedBy: Member;
  /** Per-member amounts for an uneven split; `null` means split evenly. */
  custom: Record<Member, number> | null;
  /** `settlement` rows are payments between members, not household spending. */
  kind: "expense" | "settlement";
}

export interface Household {
  id: string;
  name: string;
  /** 6-character invite code. */
  code: string;
  admin: Member;
  /** Daily spending limit, drawn as the dashed line on the charts. */
  budget: number;
  members: Member[];
  expenses: Expense[];
}

/** One suggested payment that reduces the number of debts in the household. */
export interface Settlement {
  from: Member;
  to: Member;
  amount: number;
}

/** A run of the source sentence, tagged with what the parser recognised. */
export interface Highlight {
  text: string;
  kind: "amount" | "payer" | "split" | null;
}

/** A candidate expense read out of pasted text, before the user confirms it. */
export interface ParsedExpense {
  title: string;
  amount: number;
  payer: Member;
  participants: Member[];
  date: Date;
  category: CategoryId;
  highlights: Highlight[];
  dropped: boolean;
}

/** One page of a cursor-paginated list. */
export interface Page<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
