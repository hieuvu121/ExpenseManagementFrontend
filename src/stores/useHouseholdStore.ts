import { create } from "zustand";
import { FAKE_LATENCY, ME } from "../constants/config";
import { seedHouseholds } from "../services/mockData";
import type { Expense, Household, Settlement } from "../types/domain";
import { makeExpense } from "../services/mockData";

interface HouseholdState {
  households: Household[];
  activeId: string;
  /** True until the household list has arrived. Drives the app-level skeleton. */
  loading: boolean;

  /**
   * Loads the household list. Today that is the local seed behind the same
   * simulated latency the pagination mock uses; it is the single seam where the
   * real `GET /app/v1/households` call goes.
   */
  hydrate: () => void;
  setActive: (id: string) => void;
  addHousehold: (household: Household) => void;

  /** Admin actions — approving is what puts an expense into the ledger. */
  approve: (expenseId: number) => void;
  decline: (expenseId: number) => void;
  /** Author action — pulls back an expense that is still pending. */
  withdraw: (expenseId: number) => void;
  /** Puts a reviewed expense back in the queue. Backs Undo on approve/decline. */
  restore: (expenseId: number) => void;

  addExpenses: (expenses: Expense[]) => void;
  /** Records a member paying another member, clearing that debt. */
  recordSettlement: (settlement: Settlement) => void;
}

/** Applies `fn` to the active household, leaving the others untouched. */
const mapActive = (
  state: HouseholdState,
  fn: (household: Household) => Household,
): Pick<HouseholdState, "households"> => ({
  households: state.households.map((h) => (h.id === state.activeId ? fn(h) : h)),
});

const setStatus = (id: number, status: Expense["status"]) => (h: Household) => ({
  ...h,
  expenses: h.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
});

export const useHouseholdStore = create<HouseholdState>()((set, get) => ({
  households: [],
  activeId: "",
  loading: true,

  hydrate: () => {
    // StrictMode mounts effects twice in development; without this the seed
    // would be fetched (and the skeleton shown) twice.
    if (get().households.length) return;
    setTimeout(() => {
      const seeded = seedHouseholds();
      set({ households: seeded, activeId: seeded[0]?.id ?? "", loading: false });
    }, FAKE_LATENCY);
  },

  setActive: (id) => set({ activeId: id }),

  addHousehold: (household) =>
    set((s) => ({ households: [...s.households, household] })),

  approve: (expenseId) => set((s) => mapActive(s, setStatus(expenseId, "accepted"))),
  decline: (expenseId) => set((s) => mapActive(s, setStatus(expenseId, "declined"))),
  restore: (expenseId) => set((s) => mapActive(s, setStatus(expenseId, "pending"))),

  withdraw: (expenseId) =>
    set((s) =>
      mapActive(s, (h) => ({
        ...h,
        expenses: h.expenses.filter((e) => e.id !== expenseId),
      })),
    ),

  addExpenses: (expenses) =>
    set((s) => mapActive(s, (h) => ({ ...h, expenses: [...h.expenses, ...expenses] }))),

  recordSettlement: (settlement) =>
    set((s) =>
      mapActive(s, (h) => ({
        ...h,
        expenses: [
          ...h.expenses,
          makeExpense(
            `${settlement.from} paid ${settlement.to}`,
            settlement.amount,
            settlement.from,
            [settlement.to],
            new Date(),
            { category: "other", kind: "settlement", addedBy: ME },
          ),
        ],
      })),
    ),
}));
