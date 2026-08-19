import { JOINABLE_HOUSEHOLDS, ME } from "../constants/config";
import type { Household } from "../types/domain";
import { inviteCode, nextId } from "../utils/id";

export interface CreateHouseholdInput {
  name: string;
  budget: number;
  members: string[];
}

export function createHousehold({ name, budget, members }: CreateHouseholdInput): Household {
  return {
    id: "h" + nextId(),
    name,
    code: inviteCode(),
    admin: ME,
    budget,
    members: [...members],
    expenses: [],
  };
}

export type JoinResult =
  | { ok: true; household: Household }
  | { ok: false; error: string };

/** Validates an invite code against the codes that "exist" on the server. */
export function joinHousehold(rawCode: string, existing: Household[]): JoinResult {
  const code = rawCode.trim().toUpperCase();

  if (code.length !== 6) {
    return { ok: false, error: "The code is exactly 6 characters — have another look." };
  }
  if (existing.some((h) => h.code === code)) {
    return { ok: false, error: "You're already in this household." };
  }

  const found = JOINABLE_HOUSEHOLDS[code];
  if (!found) {
    return { ok: false, error: `No household uses the code ${code}. Ask the admin to resend it.` };
  }

  return {
    ok: true,
    household: {
      id: "h" + nextId(),
      name: found.name,
      code,
      admin: found.admin,
      budget: 300_000,
      members: [...found.members, ME],
      expenses: [],
    },
  };
}
