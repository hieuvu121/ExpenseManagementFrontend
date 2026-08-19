export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Midnight today, so seeded relative dates stay stable within a session. */
export const TODAY = new Date();

/** `daysAgo(3)` -> the date three days before today, at midnight. */
export const daysAgo = (n: number): Date =>
  new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - n);

/** Zero-padded day of month, for the date column in the expense feed. */
export const dmy = (d: Date): string => String(d.getDate()).padStart(2, "0");

export const sameDay = (a: Date, b: Date): boolean =>
  a.toDateString() === b.toDateString();

export const sameMonth = (a: Date, b: Date): boolean =>
  a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
