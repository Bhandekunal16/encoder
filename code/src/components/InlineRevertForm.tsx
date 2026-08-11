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
    return (
      <div className={styles.output} role="status" aria-live="polite">
        <p className={styles.result}>{state.result}</p>
      </div>
    );
  }

  return (
    <div className={styles.output} role="alert">
      <p className={styles.error}>{state.error}</p>
    </div>
  );
}

export default function InlineRevertForm({
  inputs,
  buttonText,
}: InlineRevertFormProps) {
  const [state, action, isPending] = useActionState(revertWord, null);

  return (
    <form action={action} className={styles.form}>
      {inputs.map(({ name, type, placeholder, label }) => (
        <div key={name} className={styles.fieldGroup}>
          <label htmlFor={name} className={styles.label}>
            {label ?? placeholder}
          </label>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            autoComplete="off"
            required
          />
        </div>
      ))}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? "Reverting…" : buttonText}
      </button>
      <ActionFeedback state={state} />
    </form>
  );
}
