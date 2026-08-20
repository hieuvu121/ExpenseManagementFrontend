import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface SheetProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Sticky footer, usually Cancel + a confirm button. */
  footer?: ReactNode;
  /** Rendered between the header and the body — the expense sheet's tabs. */
  belowHeader?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), ' +
  'select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal dialog. Closes on Escape and on a click that starts and ends on the
 * scrim itself, so a drag out of the sheet does not dismiss it.
 *
 * Keyboard contract: focus moves into the panel on open, Tab cycles inside it
 * rather than escaping to the page behind, and the element that opened the
 * sheet gets focus back on close.
 */
export function Sheet({ title, onClose, children, footer, belowHeader }: SheetProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pressedScrim = useRef(false);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // A field with autoFocus wins; otherwise focus the panel so the dialog is
    // announced and Tab starts from the top of it.
    if (!panelRef.current?.contains(document.activeElement)) panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={scrimRef}
      onMouseDown={(e) => (pressedScrim.current = e.target === scrimRef.current)}
      onMouseUp={(e) => {
        if (pressedScrim.current && e.target === scrimRef.current) onClose();
        pressedScrim.current = false;
      }}
      // Bottom sheet on a phone, centred dialog from `sm` up — welding a sheet
      // to the bottom edge of a 1440px window reads as a layout bug.
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/[.42] sm:items-center sm:p-6"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          // dvh, not vh: on iOS Safari `vh` ignores the collapsing toolbar and
          // pushes the sticky footer under the browser chrome.
          "max-h-[92dvh] w-full max-w-[560px] animate-sheet-up overflow-auto",
          "rounded-t-xl border border-b-0 border-line bg-paper outline-none",
          "sm:rounded-xl sm:border-b",
        )}
      >
        <div className="sticky top-0 z-[2] flex items-center gap-3 border-b border-line bg-paper px-5 pb-3 pt-4">
          <h2 className="disp-wide flex-1 font-display text-ui-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="tap grid shrink-0 place-items-center rounded-full text-ui-lg text-ink-soft hover:bg-hover"
          >
            ×
          </button>
        </div>

        {belowHeader}

        <div className="px-5 pb-5.5 pt-4.5">{children}</div>

        {footer && (
          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-line bg-paper px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
