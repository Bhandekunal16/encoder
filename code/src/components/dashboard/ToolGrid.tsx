"use client";

import ToolCard from "./ToolCard";
import { useFilteredCategories } from "./useFilteredCategories";
import styles from "./ToolGrid.module.css";

export default function ToolGrid() {
  const { categories, isSearching } = useFilteredCategories();

  if (categories.length === 0) {
    return (
      <p className={styles.empty} role="status" aria-live="polite">
        No tools match your search.
      </p>
    );
  }

  if (isSearching) {
    const tools = categories.flatMap((category) => category.tools);

    return (
      <div className={styles.searchResults}>
        <p className={styles.searchLabel} role="status" aria-live="polite">
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
        <section
          key={category.id}
          className={styles.section}
          aria-labelledby={`category-${category.id}`}
        >
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
