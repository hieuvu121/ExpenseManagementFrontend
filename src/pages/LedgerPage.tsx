import { useOutletContext } from "react-router";
import type { Household } from "../types/domain";
import { balances, pendingExpenses, settlements } from "../utils/balances";
import { vnd } from "../utils/money";
import { Card, CardHeader } from "../components/ui/Card";
import { BalanceSpine } from "../features/balances/BalanceSpine";
import { SettlementList } from "../features/balances/SettlementList";
import { ExpenseFeed } from "../features/expenses/ExpenseFeed";

export default function LedgerPage() {
  const household = useOutletContext<Household>();

  const net = balances(household);
  const owed = settlements(net);
  const pending = pendingExpenses(household);
  const pendingSum = pending.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <section>
        <Card>
          <CardHeader title="Balance" subtitle="Approved expenses only" />
          <BalanceSpine household={household} net={net} />
          <SettlementList householdId={household.id} settlements={owed} />

          {pending.length > 0 && (
            <div className="mt-3 rounded bg-gold-tint px-2.5 py-2 text-ui-xs text-gold-text">
              {pending.length} pending {pending.length > 1 ? "expenses" : "expense"} (
              {vnd(pendingSum)} ₫) are not counted here yet.
            </div>
          )}
        </Card>
      </section>

      <section className="mt-6.5">
        <ExpenseFeed household={household} />
      </section>
    </>
  );
}
