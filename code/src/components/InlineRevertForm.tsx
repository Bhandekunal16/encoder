"use client";

import { useActionState } from "react";
import { revertWord } from "@/app/actions";
import type { ConvertInput } from "@/types/convert";
import styles from "./InlineRevertForm.module.css";

type InlineRevertFormProps = {
  inputs: ConvertInput[];
  buttonText: string;
};

function ActionFeedback({
  state,
}: {
  state: { ok: true; result: string } | { ok: false; error: string } | null;
}) {
  if (!state) {
    return null;
  }

  if (state.ok) {
    return <p className={styles.result}>{state.result}</p>;
  }

  return <p className={styles.error}>{state.error}</p>;
}

export default function InlineRevertForm({
  inputs,
  buttonText,
}: InlineRevertFormProps) {
  const [state, action, isPending] = useActionState(revertWord, null);

  return (
    <form action={action} className={styles.form}>
      {inputs.map(({ name, type, placeholder, label }) => (
        <div key={name} className={styles.field}>
          <label htmlFor={name} className={styles.srOnly}>
            {label ?? placeholder}
          </label>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            required
          />
        </div>
      ))}
      <button type="submit" disabled={isPending}>
        {isPending ? "Reverting…" : buttonText}
      </button>
      <ActionFeedback state={state} />
    </form>
  );
}
