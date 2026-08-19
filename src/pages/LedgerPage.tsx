import { useOutletContext } from "react-router";
import type { Household } from "../types/domain";

export default function LedgerPage() {
  const household = useOutletContext<Household>();
  return <div>Ledger for {household.name}</div>;
}
