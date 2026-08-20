import { useEffect, useState } from "react";
import { useModalStore, type ModalKind } from "../../stores/useModalStore";
import { usePresence } from "../../hooks/usePresence";
import { ExpenseModal } from "../../features/expenses/ExpenseModal";
import { CreateHouseholdModal } from "../../features/households/CreateHouseholdModal";
import { JoinHouseholdModal } from "../../features/households/JoinHouseholdModal";
import { SheetPresence } from "./SheetPresence";

/** Renders whichever sheet the modal store names. Only one is ever open. */
export function ModalRoot() {
  const kind = useModalStore((s) => s.kind);
  const { mounted, state } = usePresence(kind !== null, "slow");
  const [lastKind, setLastKind] = useState<ModalKind | null>(kind);

  useEffect(() => {
    if (kind) setLastKind(kind);
  }, [kind]);

  if (!mounted || !lastKind) return null;

  return (
    <SheetPresence.Provider value={state}>
      {lastKind === "expense" && <ExpenseModal />}
      {lastKind === "create" && <CreateHouseholdModal />}
      {lastKind === "join" && <JoinHouseholdModal />}
    </SheetPresence.Provider>
  );
}
