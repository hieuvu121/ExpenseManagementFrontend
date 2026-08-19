import { useToastStore } from "../../stores/useToastStore";

/** Transient confirmations, stacked above the mobile action bar. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-[26px] left-1/2 z-[99] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="max-w-[88vw] animate-fade-up rounded-full bg-ink px-4 py-[9px] text-center text-[13.5px] text-ink-invert"
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
