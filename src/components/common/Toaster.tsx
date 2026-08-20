import { useToastStore } from "../../stores/useToastStore";

/**
 * Transient confirmations, stacked above the mobile action bar.
 *
 * The live region is the wrapper, not the individual toast: screen readers
 * announce changes *inside* a region that already exists, so putting
 * role="status" on an element that is itself newly inserted announces nothing.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className={
        "pointer-events-none fixed bottom-[92px] left-1/2 z-[99] flex -translate-x-1/2 " +
        "flex-col items-center gap-2 shell:bottom-[26px]"
      }
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="max-w-[88vw] animate-fade-up rounded-full bg-ink px-4 py-2 text-center text-ui-sm text-ink-invert"
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
