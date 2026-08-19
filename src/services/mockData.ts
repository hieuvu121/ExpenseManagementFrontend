import type { Expense, Household } from "../types/domain";
import { daysAgo } from "../utils/date";
import { nextId } from "../utils/id";

/** Seeds one expense. Defaults match the common case: manual, approved, even. */
export function makeExpense(
  title: string,
  amount: number,
  payer: string,
  participants: string[],
  date: Date,
  overrides: Partial<Expense> = {},
): Expense {
  return {
    id: nextId(),
    title,
    amount,
    payer,
    participants,
    date,
    source: "manual",
    category: "other",
    status: "accepted",
    addedBy: payer,
    custom: null,
    kind: "expense",
    ...overrides,
  };
}

const ALL_21B = ["Minh", "Trang", "Huy", "An", "Bao"];
const ALL_THAO_DIEN = ["Minh", "Khoa", "Dieu"];

/** Two seeded households: one where you are the admin, one where you are not. */
export const seedHouseholds = (): Household[] => [
  {
    id: "h1",
    name: "21B Tran Quang Dieu",
    code: "K7QP2X",
    admin: "Minh",
    budget: 450_000,
    members: [...ALL_21B],
    expenses: [
      makeExpense("June rent", 9_000_000, "Bao", ALL_21B, daysAgo(75), { category: "home" }),
      makeExpense("July rent", 9_000_000, "An", ALL_21B, daysAgo(44), { category: "home" }),
      makeExpense("June electricity + water", 1_420_000, "Huy", ALL_21B, daysAgo(40), { category: "bill" }),
      makeExpense("Groceries", 710_000, "Minh", ALL_21B, daysAgo(21), { category: "market" }),
      makeExpense("August rent", 9_000_000, "Trang", ALL_21B, daysAgo(13), { category: "home" }),
      makeExpense("July electricity", 1_240_000, "Minh", ALL_21B, daysAgo(11), { category: "bill" }),
      makeExpense("Internet + trash", 385_000, "Bao", ALL_21B, daysAgo(11), { category: "bill" }),
      makeExpense("Groceries, start of week", 620_000, "Trang", ALL_21B, daysAgo(6), { category: "market" }),
      makeExpense("Hotpot at Kichi", 1_280_000, "Minh", ALL_21B, daysAgo(5), { category: "food", source: "ai" }),
      makeExpense("Water purifier", 2_400_000, "Huy", ALL_21B, daysAgo(4), {
        category: "home",
        custom: { Minh: 500_000, Trang: 500_000, Huy: 500_000, An: 450_000, Bao: 450_000 },
      }),
      makeExpense("Weekend groceries", 540_000, "An", ALL_21B, daysAgo(3), { category: "market" }),
      makeExpense("Fuel for the shared bike", 180_000, "An", ["Minh", "Huy", "An"], daysAgo(2), { category: "move" }),
      makeExpense("Morning coffee", 165_000, "Huy", ALL_21B, daysAgo(1), { category: "food", source: "ai" }),
      makeExpense("Dish soap and paper towels", 210_000, "Trang", ALL_21B, daysAgo(1), {
        category: "home",
        status: "pending",
        addedBy: "Trang",
      }),
      makeExpense("Late night snacks", 430_000, "Bao", ["Minh", "Trang", "Bao"], daysAgo(0), {
        category: "food",
        status: "pending",
        addedBy: "Bao",
        source: "ai",
      }),
      makeExpense("Fixing the kitchen tap", 350_000, "Huy", ALL_21B, daysAgo(0), {
        category: "home",
        status: "pending",
        addedBy: "Huy",
      }),
      makeExpense("Case of beer", 480_000, "An", ALL_21B, daysAgo(7), {
        category: "food",
        status: "declined",
        addedBy: "An",
      }),
    ],
  },
  {
    id: "h2",
    name: "Thao Dien apartment",
    code: "M4RD9Z",
    admin: "Khoa",
    budget: 300_000,
    members: [...ALL_THAO_DIEN],
    expenses: [
      makeExpense("August rent", 12_000_000, "Khoa", ALL_THAO_DIEN, daysAgo(15), { category: "home" }),
      makeExpense("Electricity and water", 940_000, "Dieu", ALL_THAO_DIEN, daysAgo(9), { category: "bill" }),
      makeExpense("Supermarket run", 780_000, "Minh", ALL_THAO_DIEN, daysAgo(4), { category: "market" }),
      makeExpense("Grab home", 120_000, "Minh", ["Minh", "Khoa"], daysAgo(2), {
        category: "move",
        status: "pending",
        addedBy: "Minh",
      }),
    ],
  },
];
