import { Navigate } from "react-router";
import { useHouseholdStore } from "../stores/useHouseholdStore";

/** `/` and any unknown path land on the first household's dashboard. */
export function RootRedirect() {
  const first = useHouseholdStore((s) => s.households[0]);
  return <Navigate to={`/households/${first.id}/dashboard`} replace />;
}
