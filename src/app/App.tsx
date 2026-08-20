import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { useHouseholdStore } from "../stores/useHouseholdStore";
import { usePresence } from "../hooks/usePresence";
import { AppSkeleton } from "./AppSkeleton";
import { ErrorBoundary } from "./ErrorBoundary";
import { router } from "./router";

export default function App() {
  const loading = useHouseholdStore((s) => s.loading);
  const hydrate = useHouseholdStore((s) => s.hydrate);

  useEffect(() => hydrate(), [hydrate]);

  // Hold the skeleton for one base duration past the data arriving, so it fades
  // rather than being swapped between frames. The two overlap briefly, which is
  // what stops the page flashing white on first paint.
  const skeleton = usePresence(loading, "base");

  return (
    <ErrorBoundary>
      {skeleton.mounted && (
        <div className={skeleton.state === "exiting" ? "animate-exit" : undefined}>
          <AppSkeleton />
        </div>
      )}
      {!loading && (
        <div className="animate-enter">
          <RouterProvider router={router} />
        </div>
      )}
    </ErrorBoundary>
  );
}
