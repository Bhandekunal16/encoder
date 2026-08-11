import Link from "next/link";
import InformationCard from "@/components/InformationCard";
import WordConverterForms from "@/components/WordConverterForms";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <h1>Word Converter</h1>

      <InformationCard>
        <h3>What is Word Converter?</h3>
        <ul>
          <li>Protect sensitive information by encoding or decoding text.</li>
          <li>
            Perfect for safeguarding passwords, codes, and other private data.
          </li>
          <li>Simple to use—input text and convert!</li>
        </ul>
        <h3>How to Use?</h3>
        <ul>
          <li>Enter text and click the &quot;Convert&quot; or &quot;Revert&quot; button.</li>
        </ul>
        <h3>Integration Options:</h3>
        <ul>
          <li>
            <Link href="/apiguide">API Guide</Link>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/word-encoder">NPM Package</a>
          </li>
        </ul>
      </InformationCard>

      <WordConverterForms />
    </main>
  );
}
