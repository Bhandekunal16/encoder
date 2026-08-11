import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import appConfig from "../../core/json/app.config.json";
import { RouteConfig } from "@/types/apiGuide";
import { LinksConfig } from "@/types/app";
import { validatePlaintextResult } from "@/lib/validation";

type RevertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

const { base } = routes as RouteConfig;
const { revert: pageTitle } = appConfig.TITLES;
const { back: linkText } = appConfig.LINKS as LinksConfig;

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
        <h1>{pageTitle}</h1>
        <p className={styles.answer}>{answer}</p>
        <Link href={base} className={styles.backLink}>
          {linkText}
        </Link>
      </div>
    </main>
  );
}
