"use client";

import { useActionState } from "react";
import { convertWord } from "@/app/actions";
import styles from "./ToolForm.module.css";

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
        <span className={styles.outputLabel}>Encoded result</span>
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

export default function EncodeForm() {
  const [state, action, isPending] = useActionState(convertWord, null);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor="encode-input" className={styles.label}>
          Text to encode
        </label>
        <input
          id="encode-input"
          type="text"
          name="word"
          placeholder="e.g. hello"
          autoComplete="off"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Encoding…" : "Encode"}
        </button>
      </div>

      <ActionFeedback state={state} />
    </form>
  );
}
