import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * One primary action per view, and it is always teal.
 *
 * There used to be four variants with two of them competing for "this is the
 * main action": solid ink on the dashboard's add buttons, solid teal on every
 * sheet's confirm. So the accent colour never appeared as a primary action on
 * the main screens, and the dashboard's primary read as neutral black. Teal is
 * the brand colour and it now means exactly one thing.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "border border-teal bg-teal text-white hover:bg-teal-dark hover:border-teal-dark",
  secondary: "border border-ink bg-card hover:bg-hover",
  ghost: "border border-line bg-paper text-ink hover:border-ink",
};

export function Button({ variant = "secondary", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "tap inline-flex items-center justify-center rounded-md px-3.5 py-2",
        "text-ui-sm font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
