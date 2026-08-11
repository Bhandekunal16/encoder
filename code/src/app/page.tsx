import ToolGrid from "@/components/dashboard/ToolGrid";
import { SITE_META } from "@/constants/meta";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{SITE_META.title}</h1>
        <p className={styles.pageSubtitle}>
          Choose a tool to encode, decode, or integrate.
        </p>
      </header>
      <ToolGrid />
    </>
  );
}
