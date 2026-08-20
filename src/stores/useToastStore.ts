import { create } from "zustand";
import { DURATION } from "../constants/motion";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: number;
  text: string;
  action?: ToastAction;
  leaving: boolean;
}

interface ToastState {
  toasts: Toast[];
  push: (text: string, action?: ToastAction) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

/**
 * A toast the user has to react to needs long enough to be noticed, read and acted
 * on; a bare confirmation does not.
 */
const PLAIN_MS = 2600;
const ACTION_MS = 6000;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  push: (text, action) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, text, action, leaving: false }] }));
    setTimeout(() => get().dismiss(id), action ? ACTION_MS : PLAIN_MS);
  },

  dismiss: (id) => {
    if (!get().toasts.some((t) => t.id === id && !t.leaving)) return;
    set((s) => ({
      toasts: s.toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      DURATION.base,
    );
  },
}));
