import Link from "next/link";
import { redirect } from "next/navigation";
import { revertWord } from "@/app/actions";
import styles from "./page.module.css";
import routes from "../../core/json/route.config.json";
import { RouteConfig } from "@/types/apiGuide";
import config from "../../core/json/convert.config.json";
import appConfig from "../../core/json/app.config.json";
import { ButtonsConfig, LinksConfig } from "@/types/app";
import type { ConvertConfig } from "@/types/convert";

type ConvertPageProps = {
  searchParams: Promise<{ ans?: string }>;
};

const { base } = routes as RouteConfig;
const { title: pageTitle, inputs } = config as ConvertConfig;
const { convert: buttonText } = appConfig.BUTTONS as ButtonsConfig;
const { back: linkText } = appConfig.LINKS as LinksConfig;

export default async function ConvertPage({ searchParams }: ConvertPageProps) {
  const { ans } = await searchParams;
  const answer = ans?.trim();

  if (!answer) {
    redirect(base);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>{pageTitle}</h1>
        <p className={styles.answer}>{answer}</p>
        <form action={revertWord} className={styles.form}>
          {inputs.map(({ name, type, placeholder, label }) => (
            <div key={name} className={styles.field}>
              <label htmlFor={name} className={styles.srOnly}>
                {label ?? placeholder}
              </label>
              <input
                id={name}
                type={type}
                name={name}
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          <button type="submit">{buttonText}</button>
        </form>
        <Link href={base} className={styles.backLink}>
          {linkText}
        </Link>
      </div>
    </main>
  );
}
