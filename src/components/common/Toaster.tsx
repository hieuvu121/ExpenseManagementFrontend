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
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className={
        "pointer-events-none fixed bottom-[92px] left-1/2 z-[99] flex -translate-x-1/2 " +
        "flex-col items-center gap-2 shell:bottom-6"
      }
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={
            "flex max-w-[88vw] items-center gap-3 animate-fade-up rounded-full bg-ink " +
            "py-2 pl-4 pr-2 text-center text-ui-sm text-ink-invert"
          }
        >
          <span className={toast.action ? "" : "pr-2"}>{toast.text}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.onClick();
                dismiss(toast.id);
              }}
              // The wrapper is click-through so it never blocks the page; the
              // one interactive element inside it has to opt back in.
              className={
                "tap pointer-events-auto shrink-0 rounded-full bg-ink-invert/15 px-3 py-1 " +
                "text-ui-sm font-semibold text-ink-invert hover:bg-ink-invert/25"
              }
            >
              {toast.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
