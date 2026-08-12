"use client";

import { useActionState, useId } from "react";
import { revertWord } from "@/app/actions";
import type { WordActionState } from "@/types/actions";
import styles from "./ToolForm.module.css";

type ActionFeedbackProps = {
  state: WordActionState;
  inputId: string;
  errorId: string;
  resultLabel: string;
};

function ActionFeedback({
  state,
  inputId,
  errorId,
  resultLabel,
}: ActionFeedbackProps) {
  if (!state) return null;

  if (state.ok)
    return (
      <output htmlFor={inputId} className={styles.output} aria-live="polite">
        <span className={styles.outputLabel}>{resultLabel}</span>
        <p className={styles.result}>{state.result}</p>
      </output>
    );

  return (
    <div id={errorId} className={styles.output} role="alert">
      <p className={styles.error}>{state.error}</p>
    </div>
  );
}

export default function DecodeForm() {
  const inputId = useId();
  const errorId = useId();
  const [state, action, isPending] = useActionState(revertWord, null);
  const hasError = state?.ok === false;

  return (
    <form action={action} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor={inputId} className={styles.label}>
          Encoded text
        </label>
        <input
          id={inputId}
          type="text"
          name="word"
          placeholder="e.g. 7.4.11.11.14"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          required
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? "Decoding…" : "Decode"}
        </button>
      </div>

      <ActionFeedback
        state={state}
        inputId={inputId}
        errorId={errorId}
        resultLabel="Decoded result"
      />
    </form>
  );
}
