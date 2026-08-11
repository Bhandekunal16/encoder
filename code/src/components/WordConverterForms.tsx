"use client";

import { useActionState, useState } from "react";
import { convertWord, revertWord } from "@/app/actions";
import styles from "./WordConverterForms.module.css";

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

export default function WordConverterForms() {
  const [isConvertVisible, setIsConvertVisible] = useState(true);
  const [convertState, convertAction, isConvertPending] = useActionState(
    convertWord,
    null,
  );
  const [revertState, revertAction, isRevertPending] = useActionState(
    revertWord,
    null,
  );

  function toggleForm() {
    setIsConvertVisible((visible) => !visible);
  }

  return (
    <div className={styles.main}>
      <button
        type="button"
        onClick={toggleForm}
        className={styles.switch}
        id="switch"
      >
        Switch
      </button>

      <form
        action={convertAction}
        id="convert"
        className={styles.form}
        hidden={!isConvertVisible}
      >
        <input
          type="text"
          name="word"
          placeholder="Enter a word to convert"
          required
        />
        <button type="submit" disabled={isConvertPending}>
          {isConvertPending ? "Converting…" : "Convert"}
        </button>
        <ActionFeedback state={convertState} />
      </form>

      <form
        action={revertAction}
        id="revert"
        className={styles.form}
        hidden={isConvertVisible}
      >
        <input
          type="text"
          name="word"
          placeholder="Enter a word to revert"
          required
        />
        <button type="submit" disabled={isRevertPending}>
          {isRevertPending ? "Reverting…" : "Revert"}
        </button>
        <ActionFeedback state={revertState} />
      </form>
    </div>
  );
}
