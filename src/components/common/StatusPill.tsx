import { Pill } from "../ui/Pill";
import type { ExpenseStatus } from "../../types/domain";

const LABELS: Record<ExpenseStatus, string> = {
  pending: "Pending",
  accepted: "Approved",
  declined: "Declined",
};

export function StatusPill({ status }: { status: ExpenseStatus }) {
  return <Pill tone={status}>{LABELS[status]}</Pill>;
}
