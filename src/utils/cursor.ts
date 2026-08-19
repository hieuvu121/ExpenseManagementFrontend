import type { Expense, Settlement } from "../types/domain";

/**
 * Opaque cursors. The client never sends an offset — it sends back the last
 * cursor it received, and the server resolves it to a position. Base64 here is
 * only to make the token opaque; it carries no meaning for the caller.
 */
const encode = (raw: string): string =>
  btoa(String.fromCharCode(...new TextEncoder().encode(raw))).replace(/=+$/, "");

/** Sort key is (date, id) — the same key the list is ordered by. */
export const expenseCursor = (e: Expense): string =>
  encode(`${e.date.getTime()}:${e.id}`);

export const settlementCursor = (s: Settlement): string =>
  encode(`${s.from}>${s.to}`);
