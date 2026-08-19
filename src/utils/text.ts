/**
 * Folds Vietnamese text to plain ASCII lowercase so the parser can match
 * "đi chợ", "di cho" and "Đi Chợ" with one pattern.
 */
export const stripDiacritics = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

/** Two-letter initials from the last word of a name, for avatars. */
export const initials = (name: string): string =>
  name.trim().split(/\s+/).pop()!.slice(0, 2);
