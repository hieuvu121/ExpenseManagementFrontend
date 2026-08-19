import { PASTE_SAMPLES } from "../../constants/config";
import type { Household } from "../../types/domain";
import { Button } from "../../components/ui/Button";
import { Field, Textarea } from "../../components/ui/Input";
import { ParsedExpenseList } from "./ParsedExpenseList";
import type { ExpenseDraft } from "./expenseDraft";

interface PasteTextFormProps {
  household: Household;
  draft: ExpenseDraft;
  patch: (changes: Partial<ExpenseDraft>) => void;
  onParse: () => void;
  onEdit: (index: number) => void;
}

export function PasteTextForm({ household, draft, patch, onParse, onEdit }: PasteTextFormProps) {
  const dropAt = (index: number) =>
    patch({
      parsed: draft.parsed?.map((p, i) => (i === index ? { ...p, dropped: true } : p)) ?? null,
    });

  return (
    <>
      <Field label="Paste a chat message, or just type it out" htmlFor="paste-text">
        <Textarea
          id="paste-text"
          autoFocus
          placeholder="Dinner at Kichi 1tr280, I paid, split evenly"
          value={draft.text}
          onChange={(e) => patch({ text: e.target.value })}
        />

        <div className="mt-1.5 text-xs text-ink-soft">
          Reads amounts like 1tr280, 165k, 850 nghìn, 1.2m — and phrasing in both English and
          Vietnamese (“I paid”, “t trả”, “split evenly”, “chia đều”, “yesterday”, “hôm qua”).
          Several sentences become several expenses. Text-parsed expenses always split evenly; use
          the Manual tab for 30/30/40.
        </div>

        <div className="mt-2.5 flex flex-wrap gap-2">
          <Button onClick={() => patch({ text: PASTE_SAMPLES.en })}>English example</Button>
          <Button onClick={() => patch({ text: PASTE_SAMPLES.vi })}>Vietnamese example</Button>
          <Button variant="primary" onClick={onParse}>
            Read it
          </Button>
        </div>
      </Field>

      {draft.parsed && (
        <ParsedExpenseList
          household={household}
          parsed={draft.parsed}
          onDrop={dropAt}
          onEdit={onEdit}
        />
      )}
    </>
  );
}
