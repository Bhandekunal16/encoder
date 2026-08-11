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

      <InformationCard>
        <h3>Welcome to the Counter App!</h3>
        <p>
          This simple and interactive <Link href="/count">Counter</Link> App
          lets you perform basic counting operations with ease. You can increase,
          decrease, or reset the count, and even toggle between two counters.
        </p>
        <h3>How to Use:</h3>
        <ul>
          <li>
            Primary Counter:
            <ul>
              <li>
                Use the &quot;Increase&quot;, &quot;Decrease&quot;, and
                &quot;Reset&quot; buttons in the first counter box to adjust the
                count.
              </li>
              <li>The result is displayed live below the buttons.</li>
            </ul>
          </li>
          <li>
            Show/Hide Secondary Counter:
            <ul>
              <li>Click the &quot;+&quot; button to reveal the secondary counter.</li>
              <li>Click the &quot;−&quot; button to hide it.</li>
            </ul>
          </li>
          <li>
            Secondary Counter:
            <ul>
              <li>
                Once visible, use its buttons to perform similar operations as
                the primary counter.
              </li>
            </ul>
          </li>
        </ul>
      </InformationCard>
    </main>
  );
}
