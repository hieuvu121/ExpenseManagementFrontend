/** The signed-in member. The prototype had no auth, so this is a constant. */
export const ME = "Minh";

/** Page sizes per paginated list, keyed by the list's pagination key. */
export const PAGE_SIZE = {
  recent: 5,
  expenses: 8,
  debts: 4,
} as const;

export type PageKey = keyof typeof PAGE_SIZE;

/** Simulated network latency for the mock API, in ms. */
export const FAKE_LATENCY = 420;

/** Balances below this are treated as settled, to absorb rounding. */
export const SETTLED_THRESHOLD = 500;

export const PASTE_SAMPLES = {
  en: "Dinner at Kichi 1tr280, I paid, split evenly. Huy bought coffee 165k for everyone this morning. Groceries 540k, Trang paid, split evenly",
  vi: "Tối qua ăn lẩu Kichi 1tr280, t trả trước, chia đều cả nhà. Sáng nay Huy mua cà phê 165k cho cả nhóm. Đi chợ 540k, Trang ứng, chia đều",
} as const;

/** Invite codes that "exist" on the server, for the join flow. */
export const JOINABLE_HOUSEHOLDS: Record<
  string,
  { name: string; members: string[]; admin: string }
> = {
  TB9K3M: { name: "Go Vap share house", members: ["Hung", "Lan", "Tu"], admin: "Hung" },
  PN5W7Q: { name: "Da Lat homestay", members: ["Khoa", "Dieu", "Phat"], admin: "Khoa" },
};
