import { useModalStore } from "../../stores/useModalStore";

/**
 * Renders whichever sheet the modal store names. Only one is ever open.
 * The sheets themselves land in step 6; until then opening one is a no-op.
 */
export function ModalRoot() {
  const kind = useModalStore((s) => s.kind);
  if (!kind) return null;
  return null;
}
