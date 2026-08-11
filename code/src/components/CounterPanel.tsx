"use client";

import { useState } from "react";
import styles from "./CounterPanel.module.css";

export default function CounterPanel() {
  const [count, setCount] = useState(0);
  const [display, setDisplay] = useState(0);

  const increase = () => {
    setDisplay(count);
    setCount((current) => current + 1);
  };

  const decrease = () => {
    setDisplay(count);
    setCount((current) => current - 1);
  };

  const reset = () => {
    setCount(0);
    setDisplay(0);
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.increase} onClick={increase}>
        Increase
      </button>
      <button type="button" className={styles.decrease} onClick={decrease}>
        Decrease
      </button>
      <button type="button" className={styles.reset} onClick={reset}>
        Reset
      </button>
      <p>{display}</p>
    </div>
  );
}
