import { cn } from "../../utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer h-3.5 animate-shimmer rounded-[3px]", className)} />;
}

/** Placeholder rows shown while the next page is in flight. */
export function SkeletonRows({ rows = 2, columns }: { rows?: number; columns: string }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="grid gap-3.5 border-b border-line-soft py-3.5"
          style={{ gridTemplateColumns: columns }}
        >
          {Array.from({ length: columns.split(" ").length }, (_, c) => (
            <Skeleton key={c} />
          ))}
        </div>
      ))}
    </>
  );
}
