import { cn } from "../../utils/cn";

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** The Daily / Weekly / Monthly switch on the statistics chart. */
export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex gap-0.5 rounded-md bg-hover p-[3px]">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "tap inline-flex items-center justify-center rounded px-2.5 py-[5px] text-[12.5px] font-semibold transition-colors",
            value === option.value ? "bg-card text-ink" : "text-ink-soft hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
