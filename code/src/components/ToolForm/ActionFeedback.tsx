import type { WordActionState } from "@/types/actions";
import styles from "./ToolForm.module.css";

type ActionFeedbackProps = {
  state: WordActionState;
  inputId: string;
  errorId: string;
  resultLabel: string;
};

export default function ActionFeedback({
  state,
  inputId,
  errorId,
  resultLabel,
}: ActionFeedbackProps) {
  if (!state) {
    return null;
  }

  if (state.ok) {
    return (
      <output htmlFor={inputId} className={styles.output} aria-live="polite">
        <span className={styles.outputLabel}>{resultLabel}</span>
        <p className={styles.result}>{state.result}</p>
      </output>
    );
  }

  return (
    <div id={errorId} className={styles.output} role="alert">
      <p className={styles.error}>{state.error}</p>
    </div>
  );
}
