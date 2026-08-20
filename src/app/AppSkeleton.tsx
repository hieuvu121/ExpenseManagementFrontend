import { Skeleton } from "../components/ui/Skeleton";

/**
 * What the shell looks like while the household list is in flight. Mirrors the
 * real layout's grid so nothing jumps when the data lands.
 */
export function AppSkeleton() {
  return (
    <div className="grid min-h-screen shell:grid-cols-[262px_1fr]" aria-busy="true">
      <span className="sr-only" role="status">
        Loading your households
      </span>

      <aside className="border-b border-line px-4 pb-3 pt-4 shell:h-screen shell:border-b-0 shell:border-r shell:px-4.5 shell:pt-5.5">
        <Skeleton className="mb-5.5 h-5 w-40" />
        <div className="mb-5.5 rounded-md border border-line bg-card px-3 py-3">
          <Skeleton className="mb-2 h-2.5 w-24" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex gap-1.5 shell:flex-col shell:gap-1">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-9 w-40 shell:w-full" />
          ))}
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1000px] px-4 pt-4.5 shell:px-7.5 shell:pt-6">
        <Skeleton className="mb-2 h-3 w-24" />
        <Skeleton className="mb-5.5 h-8 w-64" />

        <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>

        <Skeleton className="mb-3.5 h-40" />
        <div className="grid gap-3.5 shell:grid-cols-[1.55fr_1fr]">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      </main>
    </div>
  );
}
