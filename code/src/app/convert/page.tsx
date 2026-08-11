import Link from "next/link";
import { redirect } from "next/navigation";
import InlineRevertForm from "@/components/InlineRevertForm";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import { RouteConfig } from "@/types/apiGuide";
import config from "../../core/json/convert.config.json";
import appConfig from "../../core/json/app.config.json";
import { ButtonsConfig } from "@/types/app";
import { validateConvertConfig } from "@/lib/validateConfig";
import type { ConvertConfig } from "@/types/convert";
import { validateEncodedResult } from "@/lib/validation";

type ConvertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

const { base } = routes as RouteConfig;
const { title: pageTitle, inputs } = config as ConvertConfig;
validateConvertConfig(config as ConvertConfig);
const { convert: buttonText } = appConfig.BUTTONS as ButtonsConfig;

export default async function ConvertPage({ searchParams }: ConvertPageProps) {
  const { ans } = await searchParams;
  const validated = validateEncodedResult(ans);

  if (!validated.ok) {
    redirect(base);
  }

  const answer = validated.value;

  return (
    <div className={styles.panel}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/tools/encode" className={styles.backLink}>
          Word Encoder
        </Link>
      </nav>

      <h1 className={styles.title}>{pageTitle}</h1>

      <div className={styles.resultCard}>
        <span className={styles.resultLabel}>Encoded result</span>
        <p className={styles.result}>{answer}</p>
      </div>

      <div className={styles.formSection}>
        <InlineRevertForm inputs={inputs} buttonText={buttonText} />
      </div>
    </div>
  );
}
