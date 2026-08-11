import type { ApiSample } from "@/types/apiGuide";
import styles from "./page.module.css";

type ApiSampleSectionProps = {
  sample: ApiSample;
};

export default function ApiSampleSection({ sample }: ApiSampleSectionProps) {
  const { method, code, payload, response, title, id } = sample as ApiSample;
  const headingId = `api-sample-${id}`;
  return (
    <section className={styles.route} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>

      <p>
        <span className={styles.method}>{method}</span>
        <code>{code}</code>
      </p>

      <h3 className={styles.subheading}>Request</h3>
      <pre>
        <code>{JSON.stringify(payload, null, 2)}</code>
      </pre>

      <h3 className={styles.subheading}>Response</h3>
      <pre className={styles.response}>
        <code>{JSON.stringify(response, null, 2)}</code>
      </pre>
    </section>
  );
}
