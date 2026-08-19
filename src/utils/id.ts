let counter = 100;

/** Monotonic ids for locally created expenses and households. */
export const nextId = (): number => ++counter;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** 6-character invite code, avoiding characters that look alike. */
export const inviteCode = (): string =>
  Array.from(
    { length: 6 },
    () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)],
  ).join("");
