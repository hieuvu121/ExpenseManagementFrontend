import { Navigate } from "react-router";
import { useHouseholdStore } from "../stores/useHouseholdStore";
import { WelcomeScreen } from "./WelcomeScreen";

/**
 * `/` and any unknown path land on the first household's dashboard — unless
 * there are none, which is the state a brand-new account starts in. Reading
 * `households[0].id` unguarded white-screened the whole app there.
 */
export function RootRedirect() {
  const first = useHouseholdStore((s) => s.households[0]);
  if (!first) return <WelcomeScreen />;
  return <Navigate to={`/households/${first.id}/dashboard`} replace />;
}
