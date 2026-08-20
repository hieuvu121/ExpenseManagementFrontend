import { createContext } from "react";
import type { PresenceState } from "../../hooks/usePresence";

/**
 * Lets `Sheet` know it is animating out. Set by `ModalRoot`, which owns the
 * mount decision; `Sheet` cannot keep its own parent from unmounting it.
 */
export const SheetPresence = createContext<PresenceState>("present");
