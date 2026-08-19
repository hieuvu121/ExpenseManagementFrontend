import type { CursorPagination } from "../../hooks/useCursorPagination";
import { SkeletonRows } from "../ui/Skeleton";
import { cn } from "../../utils/cn";

interface PagerProps {
  pagination: CursorPagination<unknown>;
  /** Page size, used to decide whether the footer is worth showing at all. */
  pageSize: number;
  /** grid-template-columns for the loading skeleton rows. */
  skeletonColumns: string;
}

/**
 * Footer for a cursor-paginated list. Shows the opaque cursor that would be
 * sent next, which is the point of the exercise — the client never computes an
 * offset of its own.
 */
export function Pager({ pagination, pageSize, skeletonColumns }: PagerProps) {
  const { visible, total, loading, done, cursor, nextSize, loadMore } = pagination;

  // A list that fits on one page has nothing to page through.
  if (total <= pageSize && done) return null;

  return (
    <>
      {loading && <SkeletonRows columns={skeletonColumns} />}
      <div className="flex flex-wrap items-center gap-3 pt-[13px]">
        <span className="text-xs text-ink-muted">
          Showing {visible.length} of {total}
        </span>

        {cursor && !done && (
          <span
            title="The token sent to fetch the next page"
            className={cn(
              "max-w-[190px] truncate rounded-[3px] border border-line-soft bg-paper",
              "px-1.5 py-0.5 font-mono text-[10.5px] text-ink-muted",
            )}
          >
            cursor: {cursor}
          </span>
        )}

        {done ? (
          <span className="ml-auto text-xs text-ink-muted">End of list</span>
        ) : (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className={cn(
              "ml-auto rounded-full border border-line bg-paper px-3.5 py-1.5",
              "text-[12.5px] font-semibold text-ink hover:border-ink",
              "disabled:cursor-default disabled:opacity-55",
            )}
          >
            {loading ? (
              <>
                <span className="mr-1.5 inline-block h-[11px] w-[11px] animate-spin rounded-full border-2 border-ink-muted border-t-transparent align-[-1px]" />
                Loading
              </>
            ) : (
              `Load ${nextSize} more`
            )}
          </button>
        )}
      </div>
    </>
  );
}
