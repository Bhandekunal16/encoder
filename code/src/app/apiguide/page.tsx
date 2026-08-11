import type { Metadata } from "next";
import Link from "next/link";
import { SITE_META, TITLES } from "@/constants/meta";
import apiGuideConfig from "@/core/json/apiGuide.config.json";
import routeConfig from "@/core/json/route.config.json";
import samplesConfig from "@/core/json/samples.config.json";
import { validateSamples } from "@/lib/validateSamples";
import type {
  ApiGuideConfig,
  RouteConfig,
  SamplesConfig,
} from "@/types/apiGuide";
import type { LinksConfig } from "@/types/app";
import ApiSampleSection from "./ApiSampleSection";
import styles from "./page.module.css";
import appConfig from "@/core/json/app.config.json";

const { description } = SITE_META;
const { api: title } = TITLES;
const { base } = routeConfig as RouteConfig;
const { samples } = samplesConfig as SamplesConfig;
const {
  title: pageTitle,
  description: pageDescription,
  tooltip,
} = apiGuideConfig as ApiGuideConfig;
const { back: linkText } = appConfig.LINKS as LinksConfig;

validateSamples(samples);

export const metadata: Metadata = { title, description };

export default function ApiGuidePage() {
  return (
    <main className={styles.page}>
      <Link href={base} className={styles.back}>
        {linkText}
      </Link>

      <div className={styles.container}>
        <header>
          <h1>{pageTitle}</h1>
          <p>{pageDescription}</p>
        </header>

        {samples.map((sample) => (
          <ApiSampleSection key={sample.id} sample={sample} />
        ))}

        <footer>
          <p>{tooltip}</p>
        </footer>
      </div>
    </main>
  );
}
