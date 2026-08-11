import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import { RouteConfig } from "@/types/apiGuide";
import { validatePlaintextResult } from "@/lib/validation";

type RevertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

const { base } = routes as RouteConfig;

export default async function RevertPage({ searchParams }: RevertPageProps) {
  const { ans } = await searchParams;
  const validated = validatePlaintextResult(ans);

  if (!validated.ok) {
    redirect(base);
  }

  const answer = validated.value;

  return (
    <div className={styles.panel}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/tools/decode" className={styles.backLink}>
          Word Decoder
        </Link>
      </nav>

      <h1 className={styles.title}>Word Result</h1>

      <div className={styles.resultCard}>
        <span className={styles.resultLabel}>Decoded result</span>
        <p className={styles.result}>{answer}</p>
      </div>
    </div>
  );
}
