import Link from "next/link";
import { redirect } from "next/navigation";
import InlineRevertForm from "@/components/InlineRevertForm";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import { RouteConfig } from "@/types/apiGuide";
import config from "../../core/json/convert.config.json";
import appConfig from "../../core/json/app.config.json";
import { ButtonsConfig, LinksConfig } from "@/types/app";
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
const { back: linkText } = appConfig.LINKS as LinksConfig;

export default async function ConvertPage({ searchParams }: ConvertPageProps) {
  const { ans } = await searchParams;
  const validated = validateEncodedResult(ans);

  if (!validated.ok) {
    redirect(base);
  }

  const answer = validated.value;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>{pageTitle}</h1>
        <p className={styles.answer}>{answer}</p>
        <InlineRevertForm inputs={inputs} buttonText={buttonText} />
        <Link href={base} className={styles.backLink}>
          {linkText}
        </Link>
      </div>
    </main>
  );
}
