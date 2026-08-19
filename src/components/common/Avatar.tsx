import { initials } from "../../utils/text";

export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-hover text-[11px] font-semibold text-ink-soft"
    >
      {initials(name)}
    </span>
  );
}
