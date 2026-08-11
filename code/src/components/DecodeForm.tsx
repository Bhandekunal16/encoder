"use client";

import { useActionState } from "react";
import { revertWord } from "@/app/actions";
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
        <span className={styles.outputLabel}>Decoded result</span>
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

export default function DecodeForm() {
  const [state, action, isPending] = useActionState(revertWord, null);

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor="decode-input" className={styles.label}>
          Encoded text
        </label>
        <input
          id="decode-input"
          type="text"
          name="word"
          placeholder="e.g. 7.4.11.11.14"
          autoComplete="off"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? "Decoding…" : "Decode"}
        </button>
      </div>

      <ActionFeedback state={state} />
    </form>
  );
}
