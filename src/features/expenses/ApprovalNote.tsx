import { ME } from "../../constants/config";
import type { Household } from "../../types/domain";

/** Spells out where the expense will land, which depends on whether you're admin. */
export function ApprovalNote({ household }: { household: Household }) {
  if (household.admin === ME) {
    return (
      <div className="mt-3 rounded bg-moss-wash px-2.5 py-2 text-ui-xs text-moss-text">
        You're the admin, so this goes straight into the ledger.
      </div>
    );
  }
  return (
    <div className="mt-3 rounded bg-gold-tint px-2.5 py-2 text-ui-xs text-gold-text">
      This will sit as <b>Pending</b> until admin {household.admin} approves it, and won't affect
      balances before that.
    </div>
  );
}
