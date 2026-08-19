import { SETTLED_THRESHOLD } from "../constants/config";
import type { Expense, Household, Member, Settlement } from "../types/domain";

/** Only approved expenses move money. */
export const isLive = (e: Expense): boolean => e.status === "accepted";

/** What one member owes for an expense — their custom amount, or an even cut. */
export const shareOf = (e: Expense, member: Member): number =>
  e.custom && e.custom[member] != null
    ? e.custom[member]
    : e.amount / e.participants.length;

/**
 * Net position per member: positive means the household owes them, negative
 * means they owe the household. Paying adds, being in the split subtracts.
 */
export function balances(household: Household): Record<Member, number> {
  const net: Record<Member, number> = {};
  household.members.forEach((m) => (net[m] = 0));

  household.expenses.filter(isLive).forEach((e) => {
    net[e.payer] = (net[e.payer] ?? 0) + e.amount;
    e.participants.forEach((p) => {
      net[p] = (net[p] ?? 0) - shareOf(e, p);
    });
  });

  return net;
}

/**
 * Greedy debt simplification: repeatedly settle the largest debtor against the
 * largest creditor. Produces at most (members - 1) payments, which is the
 * fewest transfers that can clear the household.
 */
export function settlements(net: Record<Member, number>): Settlement[] {
  const creditors: [Member, number][] = [];
  const debtors: [Member, number][] = [];

  Object.entries(net).forEach(([name, value]) => {
    if (value > SETTLED_THRESHOLD) creditors.push([name, value]);
    else if (value < -SETTLED_THRESHOLD) debtors.push([name, -value]);
  });

  creditors.sort((a, b) => b[1] - a[1]);
  debtors.sort((a, b) => b[1] - a[1]);

  const out: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i][1], creditors[j][1]);
    out.push({ from: debtors[i][0], to: creditors[j][0], amount });
    debtors[i][1] -= amount;
    creditors[j][1] -= amount;
    if (debtors[i][1] < SETTLED_THRESHOLD) i++;
    if (creditors[j][1] < SETTLED_THRESHOLD) j++;
  }

  return out;
}

/** The signed-in member's net position in one household. */
export const netFor = (household: Household, member: Member): number =>
  balances(household)[member] ?? 0;

export const pendingExpenses = (household: Household): Expense[] =>
  household.expenses.filter((e) => e.status === "pending");

/** Newest first, id as the tiebreaker so the order is stable for cursors. */
export const byNewest = (a: Expense, b: Expense): number =>
  b.date.getTime() - a.date.getTime() || b.id - a.id;
