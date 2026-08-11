import type { Metadata } from "next";
import Link from "next/link";
import { SITE_META, TITLES } from "@/constants/meta";
import apiGuideConfig from "@/core/json/apiGuide.config.json";
import routeConfig from "@/core/json/route.config.json";
import samplesConfig from "@/core/json/samples.config.json";
import { validateSamples, validateEncodingSelfTests } from "@/lib/validateEncoding";
import { validateAppConfig, validateRouteConfig } from "@/lib/validateConfig";
import type {
  ApiGuideConfig,
  RouteConfig,
  SamplesConfig,
} from "@/types/apiGuide";
import ApiSampleSection from "./ApiSampleSection";
import styles from "./page.module.css";
import appConfig from "@/core/json/app.config.json";

const { description } = SITE_META;
const { api: title } = TITLES;
const { samples } = samplesConfig as SamplesConfig;
const {
  title: pageTitle,
  description: pageDescription,
  tooltip,
} = apiGuideConfig as ApiGuideConfig;

validateSamples(samples);
validateEncodingSelfTests();
validateAppConfig(appConfig);
validateRouteConfig(routeConfig as RouteConfig);

export const metadata: Metadata = { title, description };

export default function ApiGuidePage() {
  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.backLink}>
          All Tools
        </Link>
      </nav>

      <h1 className={styles.title}>{pageTitle}</h1>
      <p className={styles.description}>{pageDescription}</p>

      {samples.map((sample) => (
        <ApiSampleSection key={sample.id} sample={sample} />
      ))}

      <footer className={styles.footer}>
        <p>{tooltip}</p>
      </footer>
    </div>
  );
}
