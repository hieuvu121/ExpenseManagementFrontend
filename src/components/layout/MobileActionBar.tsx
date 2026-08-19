import { useModalStore } from "../../stores/useModalStore";
import { Button } from "../ui/Button";

/** Below the shell breakpoint the two add actions move to a fixed bottom bar. */
export function MobileActionBar() {
  const openModal = useModalStore((s) => s.open);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-line bg-paper px-3.5 pt-2.5 shell:hidden"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <Button className="flex-1 py-3 text-center" onClick={() => openModal("expense", "manual")}>
        Add manually
      </Button>
      <Button
        variant="primary"
        className="flex-1 py-3 text-center"
        onClick={() => openModal("expense", "ai")}
      >
        Paste text
      </Button>
    </div>
  );
}
