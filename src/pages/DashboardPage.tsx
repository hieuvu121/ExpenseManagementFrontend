import { useOutletContext } from "react-router";
import type { Household } from "../types/domain";

export default function DashboardPage() {
  const household = useOutletContext<Household>();
  return <div>Dashboard for {household.name}</div>;
}
