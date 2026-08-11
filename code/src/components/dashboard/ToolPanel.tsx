import Link from "next/link";
import styles from "./ToolPanel.module.css";

type ToolPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function ToolPanel({
  title,
  description,
  children,
}: ToolPanelProps) {
  return (
    <section className={styles.panel} aria-labelledby="tool-title">
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.backLink}>
          All Tools
        </Link>
      </nav>

      <header className={styles.header}>
        <h1 id="tool-title" className={styles.title}>
          {title}
        </h1>
        {description ? <p className={styles.description}>{description}</p> : null}
      </header>

      <div className={styles.body}>{children}</div>
    </section>
  );
}
