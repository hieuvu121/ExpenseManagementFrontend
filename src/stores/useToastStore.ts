import { create } from "zustand";

export interface Toast {
  id: number;
  text: string;
}

interface ToastState {
  toasts: Toast[];
  push: (text: string) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (text) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2100);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
