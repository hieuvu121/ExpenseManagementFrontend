import { useModalStore } from "../../stores/useModalStore";
import { ExpenseModal } from "../../features/expenses/ExpenseModal";
import { CreateHouseholdModal } from "../../features/households/CreateHouseholdModal";
import { JoinHouseholdModal } from "../../features/households/JoinHouseholdModal";

/** Renders whichever sheet the modal store names. Only one is ever open. */
export function ModalRoot() {
  const kind = useModalStore((s) => s.kind);

  if (kind === "expense") return <ExpenseModal />;
  if (kind === "create") return <CreateHouseholdModal />;
  if (kind === "join") return <JoinHouseholdModal />;
  return null;
}
