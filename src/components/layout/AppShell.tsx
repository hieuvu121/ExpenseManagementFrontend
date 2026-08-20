import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import { Sidebar } from "./Sidebar";
import { MobileActionBar } from "./MobileActionBar";
import { HouseholdHeader } from "./HouseholdHeader";
import { ViewTabs } from "./ViewTabs";
import { EmptyState } from "../common/EmptyState";
import { ModalRoot } from "../common/ModalRoot";
import { Toaster } from "../common/Toaster";

/**
 * Sidebar + main column. Also keeps the store's `activeId` in step with the
 * URL, so store actions know which household they are mutating.
 *
 * The modals live here rather than beside RouterProvider so that they sit
 * inside the router context — they navigate after creating or joining.
 */
export function AppShell() {
  const { householdId } = useParams();
  const households = useHouseholdStore((s) => s.households);
  const setActive = useHouseholdStore((s) => s.setActive);

  const household = households.find((h) => h.id === householdId);

  useEffect(() => {
    if (household) setActive(household.id);
  }, [household, setActive]);

  return (
    <div className="grid min-h-screen shell:grid-cols-[262px_1fr]">
      <Sidebar />
      {/* mx-auto: max-w alone pinned the column to the left edge, leaving ~650px
          of empty paper on a 1920px screen. The tall bottom padding clears the
          fixed MobileActionBar, which is shell:hidden — so the desktop shell
          does not need it. */}
      <main className="mx-auto w-full max-w-[1000px] px-4 pb-[130px] pt-[18px] shell:px-[30px] shell:pb-10 shell:pt-6">
        {household ? (
          <>
            <HouseholdHeader household={household} />
            <ViewTabs householdId={household.id} />
            <Outlet context={household} />
          </>
        ) : (
          <EmptyState title="Household not found">
            Pick one from the list, or join another with an invite code.
          </EmptyState>
        )}
      </main>
      <MobileActionBar />
      <ModalRoot />
      <Toaster />
    </div>
  );
}
