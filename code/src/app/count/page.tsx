"use client";

import { useState } from "react";
import CounterPanel from "@/components/CounterPanel";
import styles from "./page.module.css";

export default function CountPage() {
  const [showSecondary, setShowSecondary] = useState(false);

  return (
    <main className={styles.page}>
      <h1>Count</h1>
      <button
        type="button"
        className={styles.toggleAdd}
        onClick={() => setShowSecondary(true)}
      >
        +
      </button>
      <button
        type="button"
        className={styles.toggleSub}
        onClick={() => setShowSecondary(false)}
      >
        −
      </button>

      <div className={styles.outerContainer}>
        <CounterPanel />

        {showSecondary && (
          <div className={styles.cover}>
            <CounterPanel />
          </div>
        )}
      </div>
    </main>
  );
}
