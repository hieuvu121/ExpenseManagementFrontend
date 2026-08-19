import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type Variant = "default" | "primary" | "teal" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  default: "border border-ink bg-card hover:bg-hover",
  primary: "border border-ink bg-ink text-ink-invert hover:bg-ink/90",
  teal: "border border-teal bg-teal text-white hover:bg-teal-dark",
  ghost: "border border-line bg-paper text-ink hover:border-ink",
};

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-md px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
