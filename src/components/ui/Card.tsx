import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-md border border-line bg-card px-[18px] py-4", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  /** Rendered at the right of the header — a segmented control, a pill, a link. */
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="mb-3.5 flex items-start gap-3">
      <div className="flex-1">
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitle && <p className="mt-px text-[12.5px] text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
