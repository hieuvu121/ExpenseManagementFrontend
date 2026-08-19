import { create } from "zustand";

export type ModalKind = "expense" | "create" | "join";
export type ExpenseTab = "manual" | "ai";

interface ModalState {
  kind: ModalKind | null;
  /** Which tab the expense sheet opens on. Form state itself is local to the form. */
  expenseTab: ExpenseTab;
  open: (kind: ModalKind, expenseTab?: ExpenseTab) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  kind: null,
  expenseTab: "manual",
  open: (kind, expenseTab = "manual") => set({ kind, expenseTab }),
  close: () => set({ kind: null }),
}));
