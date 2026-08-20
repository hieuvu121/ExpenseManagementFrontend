import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useHouseholdStore } from "../stores/useHouseholdStore";
import { AppSkeleton } from "./AppSkeleton";
import { ErrorBoundary } from "./ErrorBoundary";
import { router } from "./router";

export default function App() {
  const loading = useHouseholdStore((s) => s.loading);
  const hydrate = useHouseholdStore((s) => s.hydrate);

  useEffect(() => hydrate(), [hydrate]);

  return <ErrorBoundary>{loading ? <AppSkeleton /> : <RouterProvider router={router} />}</ErrorBoundary>;
}
