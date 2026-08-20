import { useModalStore } from "../stores/useModalStore";
import { Button } from "../components/ui/Button";
import { ModalRoot } from "../components/common/ModalRoot";
import { Toaster } from "../components/common/Toaster";

/**
 * Shown when the member belongs to no households at all — the day-one state.
 * It mounts its own ModalRoot and Toaster because it renders outside AppShell.
 */
export function WelcomeScreen() {
  const openModal = useModalStore((s) => s.open);

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-[440px] text-center">
        <div className="mb-2 flex items-baseline justify-center gap-2">
          <b className="disp-narrow font-display text-ui-xl font-extrabold">Housemate</b>
        </div>
        <p className="text-ink-soft">shared household expenses</p>

        <div className="mt-7 rounded-md border border-dashed border-line bg-card p-6">
          <b className="mb-1 block text-ui-md text-ink">You're not in a household yet</b>
          <p className="text-ui-sm text-ink-soft">
            Start one and invite your housemates, or join an existing one with the 6-character code
            the admin gave you.
          </p>

          <div className="mt-5 flex flex-col gap-2 xsm:flex-row">
            <Button variant="primary" className="flex-1 py-3" onClick={() => openModal("create")}>
              Create a household
            </Button>
            <Button className="flex-1 py-3" onClick={() => openModal("join")}>
              Join with a code
            </Button>
          </div>
        </div>
      </div>

      <ModalRoot />
      <Toaster />
    </div>
  );
}
