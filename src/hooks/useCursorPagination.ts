import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPage } from "../services/paginationApi";

export interface CursorPagination<T> {
  /** The rows loaded so far. */
  visible: T[];
  total: number;
  loading: boolean;
  /** True once every row has been loaded. */
  done: boolean;
  /** The token that would be sent to fetch the next page. Shown in the UI. */
  cursor: string | null;
  /** How many rows the next page would add. */
  nextSize: number;
  loadMore: () => void;
}

/**
 * Drives one cursor-paginated list.
 *
 * Only `visible.length` is tracked locally — the cursor itself is always
 * re-derived from the last visible row, so the list stays correct when an
 * expense is approved or added underneath it.
 */
export function useCursorPagination<T>(
  items: T[],
  keyOf: (item: T) => string,
  pageSize: number,
  /** Changing this resets the list to its first page — e.g. switching household. */
  resetKey: string,
): CursorPagination<T> {
  const [count, setCount] = useState(pageSize);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCount(pageSize);
    setLoading(false);
  }, [resetKey, pageSize]);

  const visible = items.slice(0, count);
  const cursor = visible.length ? keyOf(visible[visible.length - 1]) : null;
  const done = count >= items.length;

  // Held in a ref so `loadMore` stays stable while still seeing current values.
  const latest = useRef({ items, keyOf, cursor, done, loading });
  latest.current = { items, keyOf, cursor, done, loading };

  const loadMore = useCallback(() => {
    const { items: list, keyOf: key, cursor: from, done: finished, loading: busy } = latest.current;
    if (busy || finished) return;

    setLoading(true);
    fetchPage(list, from, pageSize, key).then((page) => {
      setCount((c) => c + page.items.length);
      setLoading(false);
    });
  }, [pageSize]);

  return {
    visible,
    total: items.length,
    loading,
    done,
    cursor,
    nextSize: Math.min(pageSize, items.length - visible.length),
    loadMore,
  };
}
