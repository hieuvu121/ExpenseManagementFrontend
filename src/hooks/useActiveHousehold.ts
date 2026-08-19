import { useHouseholdStore } from "../stores/useHouseholdStore";
import type { Household } from "../types/domain";

/**
 * The household the store is currently pointed at. AppShell keeps `activeId` in
 * step with the URL, so this works from anywhere — including the modals, which
 * render outside the routed outlet.
 */
export function useActiveHousehold(): Household | undefined {
  return useHouseholdStore((s) => s.households.find((h) => h.id === s.activeId));
}
