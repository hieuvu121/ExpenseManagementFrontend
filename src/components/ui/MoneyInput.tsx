import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { maskMoney } from "../../utils/money";

interface MoneyInputProps {
  id?: string;
  value: string;
  onChange: (masked: string) => void;
  /** `large` is the headline amount at the top of the expense sheet. */
  size?: "large" | "small";
  invalid?: boolean;
  describedBy?: string;
  className?: string;
}

/** Numeric input that re-formats with thousands separators as you type. */
export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(function MoneyInput(
  { id, value, onChange, size = "large", invalid, describedBy, className },
  ref,
) {
  if (size === "small") {
    return (
      <input
        ref={ref}
        inputMode="numeric"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(maskMoney(e.target.value))}
        className={cn(
          "w-[130px] rounded border border-line bg-card px-2.5 py-1.5 text-right font-mono",
          className,
        )}
      />
    );
  }

  return (
    <div className="relative">
      <input
        ref={ref}
        id={id}
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        value={value}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e) => onChange(maskMoney(e.target.value))}
        className={cn(
          "w-full rounded-md border border-line bg-card py-2 pl-3 pr-11 font-mono text-ui-2xl font-semibold",
          "focus:border-teal focus:outline-none focus:ring-[3px] focus:ring-teal/[.12]",
          invalid && "border-rose focus:border-rose focus:ring-rose/[.12]",
          className,
        )}
      />
      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ui-md text-ink-soft">
        ₫
      </span>
    </div>
  );
});
