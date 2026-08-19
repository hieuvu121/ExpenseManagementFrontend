/** Formatting helpers for VND amounts. All amounts are whole dong. */

/** 1234567 -> "1,234,567" */
export const vnd = (n: number): string => Math.round(n).toLocaleString("en-US");

/** 1200 -> "+1,200", -1200 -> "−1,200" (a real minus sign, not a hyphen). */
export const signed = (n: number): string =>
  (n > 0 ? "+" : n < 0 ? "−" : "") + vnd(Math.abs(n));

/** Axis labels and chips: 1450000 -> "1.5M", 450000 -> "450K". */
export function compact(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + "M";
  if (n >= 1e3) return Math.round(n / 1e3) + "K";
  return String(Math.round(n));
}

/** Reads digits out of a masked input value. "1,280,000" -> 1280000 */
export const parseMoneyInput = (value: string): number =>
  parseInt(String(value).replace(/\D/g, ""), 10) || 0;

/** Re-formats an input's raw text with thousands separators as you type. */
export const maskMoney = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return digits ? parseInt(digits, 10).toLocaleString("en-US") : "";
};
