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

/**
 * Bottom-anchored modal sheet. Closes on Escape and on a click that starts and
 * ends on the scrim itself, so a drag out of the sheet does not dismiss it.
 */
export function Sheet({ title, onClose, children, footer, belowHeader }: SheetProps) {
  const scrimRef = useRef<HTMLDivElement>(null);
  const pressedScrim = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/[.42]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "max-h-[92vh] w-full max-w-[560px] animate-sheet-up overflow-auto",
          "rounded-t-xl border border-b-0 border-line bg-paper",
        )}
      >
        <div className="sticky top-0 z-[2] flex items-center gap-3 border-b border-line bg-paper px-5 pb-3 pt-4">
          <h2 className="disp-wide flex-1 font-display text-[19px] font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-[30px] w-[30px] rounded-full text-xl text-ink-soft hover:bg-hover"
          >
            ×
          </button>
        </div>

        {belowHeader}

        <div className="px-5 pb-[22px] pt-[18px]">{children}</div>

        {footer && (
          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-line bg-paper px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
