"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterCategories } from "@/lib/tools";
import { useSearch } from "./SearchContext";
import { ToolIconGlyph } from "./icons";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const { query, setQuery } = useSearch();
  const filteredCategories = filterCategories(query);

  const isHome = pathname === "/";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.search}>
        <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Type to search for tools..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search tools"
        />
      </div>

      <nav className={styles.nav} aria-label="Tools navigation">
        <Link
          href="/"
          className={`${styles.navItem} ${isHome ? styles.navItemActive : ""}`}
        >
          <svg className={styles.homeIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 6.5L8 2l6 4.5V13a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          All Tools
        </Link>

        {filteredCategories.length === 0 ? (
          <p className={styles.empty}>No tools match your search.</p>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryLabel}>{category.label}</div>
              <div className={styles.toolList}>
                {category.tools.map((tool) => {
                  const isActive = !tool.external && pathname === tool.href;
                  const className = `${styles.navItem} ${isActive ? styles.navItemActive : ""}`;

                  if (tool.external) {
                    return (
                      <a
                        key={tool.id}
                        href={tool.href}
                        className={className}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ToolIconGlyph icon={tool.icon} className={styles.toolIcon} />
                        {tool.title}
                      </a>
                    );
                  }

                  return (
                    <Link key={tool.id} href={tool.href} className={className}>
                      <ToolIconGlyph icon={tool.icon} className={styles.toolIcon} />
                      {tool.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
