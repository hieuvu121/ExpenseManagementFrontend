import { FAKE_LATENCY } from "../constants/config";
import type { Page } from "../types/domain";

/**
 * Stand-in for a cursor-paginated endpoint.
 *
 * The caller sends back the last cursor it received rather than an offset, and
 * this resolves that token to a position in the list. Swapping this for a real
 * `fetch` is the only change needed to move off mock data.
 */
export function fetchPage<T>(
  items: T[],
  cursor: string | null,
  limit: number,
  keyOf: (item: T) => string,
): Promise<Page<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let start = 0;
      if (cursor) {
        const at = items.findIndex((item) => keyOf(item) === cursor);
        // An unknown cursor (the row was deleted) restarts from the top rather
        // than failing — the client has no way to recover otherwise.
        start = at < 0 ? 0 : at + 1;
      }

      const slice = items.slice(start, start + limit);
      resolve({
        items: slice,
        nextCursor: slice.length ? keyOf(slice[slice.length - 1]) : cursor,
        hasMore: start + limit < items.length,
      });
    }, FAKE_LATENCY);
  });
}
