"use client";

import { useActionState, useId } from "react";
import type { WordActionState } from "@/types/actions";
import ActionFeedback from "./ActionFeedback";
import styles from "./ToolForm.module.css";

type WordFormAction = (
  prevState: WordActionState,
  formData: FormData,
) => WordActionState | Promise<WordActionState>;

type ToolFormProps = {
  action: WordFormAction;
  label: string;
  placeholder: string;
  submitLabel: string;
  pendingLabel: string;
  resultLabel: string;
  encodedInput?: boolean;
};

export default function ToolForm({
  action,
  label,
  placeholder,
  submitLabel,
  pendingLabel,
  resultLabel,
  encodedInput = false,
}: ToolFormProps) {
  const inputId = useId();
  const errorId = useId();
  const [state, formAction, isPending] = useActionState(action, null);
  const hasError = state?.ok === false;

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.fieldGroup}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <input
          id={inputId}
          type="text"
          name="word"
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize={encodedInput ? "off" : undefined}
          autoCorrect={encodedInput ? "off" : undefined}
          spellCheck={encodedInput ? false : undefined}
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
          {isPending ? pendingLabel : submitLabel}
        </button>
      </div>

      <ActionFeedback
        state={state}
        inputId={inputId}
        errorId={errorId}
        resultLabel={resultLabel}
      />
    </form>
  );
}
