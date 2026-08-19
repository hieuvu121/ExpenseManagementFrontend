import { useState } from "react";
import { useNavigate } from "react-router";
import { joinHousehold } from "../../services/householdsApi";
import { useHouseholdStore } from "../../stores/useHouseholdStore";
import { useModalStore } from "../../stores/useModalStore";
import type { Household } from "../../types/domain";
import { Button } from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { Sheet } from "../../components/ui/Sheet";
import { EmptyState } from "../../components/common/EmptyState";

export function JoinHouseholdModal() {
  const close = useModalStore((s) => s.close);
  const households = useHouseholdStore((s) => s.households);
  const addHousehold = useHouseholdStore((s) => s.addHousehold);
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [joined, setJoined] = useState<Household | null>(null);

  if (joined) {
    return (
      <Sheet
        title="You're in"
        onClose={close}
        footer={
          <Button
            variant="teal"
            onClick={() => {
              close();
              navigate(`/households/${joined.id}/dashboard`);
            }}
          >
            Open it
          </Button>
        }
      >
        <EmptyState title={joined.name} className="text-left">
          You're member number {joined.members.length}. {joined.admin} is the admin, so anything you
          add waits for their approval.
        </EmptyState>
      </Sheet>
    );
  }

  const submit = () => {
    const result = joinHousehold(code, households);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    addHousehold(result.household);
    setJoined(result.household);
  };

  return (
    <Sheet
      title="Join with a code"
      onClose={close}
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button variant="teal" onClick={submit}>
            Join
          </Button>
        </>
      }
    >
      <Field label="6-character invite code" htmlFor="invite-code">
        <Input
          id="invite-code"
          autoFocus
          autoComplete="off"
          maxLength={6}
          placeholder="K7QP2X"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="text-center font-mono text-[26px] uppercase tracking-[.34em]"
        />

        {error ? (
          <div className="mt-1.5 text-[12.5px] text-rose">{error}</div>
        ) : (
          <div className="mt-1.5 text-xs text-ink-soft">
            Ask the household admin for it. Try <b>TB9K3M</b> to see how it works.
          </div>
        )}
      </Field>
    </Sheet>
  );
}
