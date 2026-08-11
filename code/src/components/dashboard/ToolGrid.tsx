"use client";

import { filterCategories } from "@/lib/tools";
import { useSearch } from "./SearchContext";
import ToolCard from "./ToolCard";
import styles from "./ToolGrid.module.css";

export default function ToolGrid() {
  const { query } = useSearch();
  const categories = filterCategories(query);
  const isSearching = query.trim().length > 0;

  if (categories.length === 0) {
    return <p className={styles.empty}>No tools match your search.</p>;
  }

  if (isSearching) {
    const tools = categories.flatMap((category) => category.tools);

    return (
      <div className={styles.searchResults}>
        <p className={styles.searchLabel}>
          {tools.length} {tools.length === 1 ? "result" : "results"}
        </p>
        <div className={styles.grid}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sections}>
      {categories.map((category) => (
        <section key={category.id} className={styles.section} aria-labelledby={`category-${category.id}`}>
          <h2 id={`category-${category.id}`} className={styles.sectionTitle}>
            {category.label}
          </h2>
          <div className={styles.grid}>
            {category.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
