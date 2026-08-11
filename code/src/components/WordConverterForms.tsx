"use client";

import { useState } from "react";
import { convertWord, revertWord } from "@/app/actions";
import styles from "./WordConverterForms.module.css";

export default function WordConverterForms() {
  const [isConvertVisible, setIsConvertVisible] = useState(true);

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
        action={convertWord}
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
        <button type="submit">Convert</button>
      </form>

      <form
        action={revertWord}
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
        <button type="submit">Revert</button>
      </form>
    </div>
  );
}
