import Link from "next/link";
import { useId, type ReactNode } from "react";
import styles from "./ToolPanel.module.css";

type ToolPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function ToolPanel({
  title,
  description,
  children,
}: ToolPanelProps) {
  const titleId = useId();
  const descriptionId = useId();
  const trimmedDescription = description?.trim();
  const hasDescription = Boolean(trimmedDescription);

  return (
    <section
      className={styles.panel}
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
    >
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.backLink}>
          All Tools
        </Link>
      </div>

      <header className={styles.header}>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        {hasDescription ? (
          <p id={descriptionId} className={styles.description}>
            {trimmedDescription}
          </p>
        ) : null}
      </header>

      <div className={styles.body}>{children}</div>
    </section>
  );
}
