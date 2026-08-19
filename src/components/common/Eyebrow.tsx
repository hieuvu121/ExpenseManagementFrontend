import { cn, EYEBROW } from "../../utils/cn";

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(EYEBROW, className)}>{children}</div>;
}
