import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

type RevertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

export default async function RevertPage({ searchParams }: RevertPageProps) {
  const { ans } = await searchParams;

  if (!ans) {
    redirect("/");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Word Result</h1>
        <p>
          <strong>{ans}</strong>
        </p>
        <Link href="/" className={styles.backLink}>
          Go Back
        </Link>
      </div>
    </main>
  );
}
