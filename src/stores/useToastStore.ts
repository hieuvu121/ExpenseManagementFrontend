import { create } from "zustand";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  text: string;
  action?: ToastAction;
}

interface ToastState {
  toasts: Toast[];
  push: (text: string, action?: ToastAction) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

/**
 * A toast the user has to react to needs long enough to be noticed, read and
 * acted on; a bare confirmation does not. 2.1s was too short for either.
 */
const PLAIN_MS = 2600;
const ACTION_MS = 6000;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (text, action) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, text, action }] }));
    setTimeout(() => get().dismiss(id), action ? ACTION_MS : PLAIN_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
