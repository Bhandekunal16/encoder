import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import { RouteConfig } from "@/types/apiGuide";
import appConfig from "../../core/json/app.config.json";
import { validatePlaintextResult } from "@/lib/validation";
import { LinksConfig } from "@/types/app";
import revertConfig from "../../core/json/revert.config.json";
import routeConfig from "../../core/json/route.config.json";

const { LINKS } = appConfig as { LINKS: LinksConfig };
const { wordDecoder } = LINKS;
const { title, resultLabel } = revertConfig as {
  title: string;
  resultLabel: string;
};
const { wordDecoderUrl } = routeConfig as { wordDecoderUrl: string };

type RevertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

const { base } = routes as RouteConfig;

export default async function RevertPage({ searchParams }: RevertPageProps) {
  const { ans } = await searchParams;
  const validated = validatePlaintextResult(ans);

  if (!validated.ok) redirect(base);

  const answer = validated.value;

  return (
    <div className={styles.panel}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={wordDecoderUrl} className={styles.backLink}>
          {wordDecoder}
        </Link>
      </nav>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.resultCard}>
        <span className={styles.resultLabel}>{resultLabel}</span>
        <p className={styles.result}>{answer}</p>
      </div>
    </div>
  );
}
