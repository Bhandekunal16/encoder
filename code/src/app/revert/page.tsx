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
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Word Result</h1>
        <p>
          <strong>{answer}</strong>
        </p>
        <Link href={base} className={styles.backLink}>
          Go Back
        </Link>
      </div>
    </main>
  );
}
