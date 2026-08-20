import { useState } from "react";
import { useNavigate } from "react-router";
import { ME } from "../../constants/config";
import { useToast } from "../../hooks/useToast";
import { createHousehold } from "../../services/householdsApi";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import { useModalStore } from "../../stores/useModalStore";
import type { Household } from "../../types/domain";
import { maskMoney, parseMoneyInput } from "../../utils/money";
import { Button } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Chip";
import { Field, Input } from "../../components/ui/Input";
import { Sheet } from "../../components/ui/Sheet";
import { EmptyState } from "../../components/common/EmptyState";

export function CreateHouseholdModal() {
  const close = useModalStore((s) => s.close);
  const addHousehold = useHouseholdStore((s) => s.addHousehold);
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [members, setMembers] = useState<string[]>([ME]);
  const [newMember, setNewMember] = useState("");
  const [created, setCreated] = useState<Household | null>(null);

  const openCreated = () => {
    if (!created) return;
    close();
    navigate(`/households/${created.id}/dashboard`);
  };

  if (created) {
    return (
      <Sheet
        title="Household created"
        onClose={close}
        footer={
          <Button variant="teal" onClick={openCreated}>
            Open it
          </Button>
        }
      >
        <EmptyState title={created.name} className="text-left">
          You're the admin here, so anything your housemates add will wait for your approval. Share
          the code below.
          <div className="mt-3.5 inline-flex items-center gap-2.5 rounded-md border border-dashed border-line bg-card px-2.5 py-1.5">
            <b className="font-mono text-[22px] font-semibold tracking-code">{created.code}</b>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard?.writeText(created.code);
                toast(`Copied invite code ${created.code}`);
              }}
              className="tap inline-flex items-center text-[11.5px] font-semibold text-teal-dark hover:underline"
            >
              Copy
            </button>
          </div>
        </EmptyState>
      </Sheet>
    );
  }

  const addMember = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return;
    if (!members.includes(trimmed)) setMembers([...members, trimmed]);
    setNewMember("");
  };

  const submit = () => {
    if (!name.trim()) return toast("Give the household a name first");
    const household = createHousehold({
      name: name.trim(),
      budget: parseMoneyInput(budget) || 300_000,
      members,
    });
    addHousehold(household);
    setCreated(household);
  };

  return (
    <Sheet
      title="Create a household"
      onClose={close}
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button variant="teal" onClick={submit}>
            Create
          </Button>
        </>
      }
    >
      <Field label="Household name" htmlFor="household-name">
        <Input
          id="household-name"
          autoFocus
          autoComplete="off"
          placeholder="21B Tran Quang Dieu, Thao Dien apartment…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>

      <Field label="Daily spending limit" htmlFor="household-budget">
        <Input
          id="household-budget"
          inputMode="numeric"
          autoComplete="off"
          className="font-mono"
          placeholder="450,000"
          value={budget}
          onChange={(e) => setBudget(maskMoney(e.target.value))}
        />
        <div className="mt-1.5 text-xs text-ink-soft">
          Drawn as the dashed line on the charts. Leave it blank if you'd rather not.
        </div>
      </Field>

      <Field label="Members" htmlFor="household-member">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {members.map((member) => (
            <Chip
              key={member}
              pressed
              select="none"
              ariaLabel={member === ME ? `${member} (you, admin)` : `Remove ${member}`}
              onClick={() => member !== ME && setMembers(members.filter((m) => m !== member))}
            >
              {member}
              {member === ME ? " (you · admin)" : " ×"}
            </Chip>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            id="household-member"
            autoComplete="off"
            placeholder="Add someone…"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addMember();
              }
            }}
          />
          <Button onClick={addMember}>Add</Button>
        </div>

        <div className="mt-1.5 text-xs text-ink-soft">
          Anyone joining with the invite code shows up here automatically.
        </div>
      </Field>
    </Sheet>
  );
}
