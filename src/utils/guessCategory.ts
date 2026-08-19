import { CATEGORY_KEYWORDS } from "../constants/categories";
import type { CategoryId } from "../types/domain";
import { stripDiacritics } from "./text";

/** First matching keyword rule wins; falls back to "other". */
export function guessCategory(title: string): CategoryId {
  const flat = stripDiacritics(title);
  for (const [id, pattern] of CATEGORY_KEYWORDS) {
    if (pattern.test(flat)) return id;
  }
  return "other";
}
