import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

const BASE =
  "w-full rounded-md border border-line bg-card px-3 py-2.5 text-[15px] " +
  "focus:border-teal focus:outline-none focus:ring-[3px] focus:ring-teal/[.12]";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(BASE, className)} {...props} />;
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(BASE, "min-h-[112px] resize-y leading-relaxed", className)}
      {...props}
    />
  );
});

interface FieldProps {
  label: string;
  htmlFor?: string;
  /** Small right-aligned control in the label row, e.g. "Select all". */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, htmlFor, aside, children, className }: FieldProps) {
  return (
    <div className={cn("mb-4", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold uppercase tracking-label text-ink-soft"
        >
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
