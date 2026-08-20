import { signed, vnd } from "../../utils/money";
import { cn, NUM } from "../../utils/cn";

interface MoneyProps {
  value: number;
  /** Show a leading + / − and colour by direction. */
  withSign?: boolean;
  /** Append the đồng symbol. */
  unit?: boolean;
  className?: string;
}

export function Money({ value, withSign, unit, className }: MoneyProps) {
  const tone = withSign ? (value > 0 ? "text-moss-text" : value < 0 ? "text-rose-text" : "") : "";
  return (
    <span className={cn(NUM, tone, className)}>
      {withSign ? signed(value) : vnd(value)}
      {unit ? " ₫" : ""}
    </span>
  );
}
