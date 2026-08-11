import Link from "next/link";
import type { Tool } from "@/types/tools";
import { ToolIconGlyph } from "./icons";
import styles from "./ToolCard.module.css";

type ToolCardProps = {
  tool: Tool;
};

export default function ToolCard({ tool }: ToolCardProps) {
  const content = (
    <>
      <div className={styles.iconWrap}>
        <ToolIconGlyph icon={tool.icon} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{tool.title}</h3>
      <p className={styles.description}>{tool.description}</p>
    </>
  );

  if (tool.external) {
    return (
      <a
        href={tool.href}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={tool.href} className={styles.card}>
      {content}
    </Link>
  );
}
