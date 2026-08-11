"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { filterCategories } from "@/lib/tools";
import type { Tool } from "@/types/tools";
import { useSearch } from "./SearchContext";
import { ToolIconGlyph } from "./icons";
import styles from "./Sidebar.module.css";

type ToolNavItemProps = {
  tool: Tool;
  isActive: boolean;
};

function ToolNavItem({ tool, isActive }: ToolNavItemProps) {
  const className = `${styles.navItem} ${isActive ? styles.navItemActive : ""}`;

  const content = (
    <>
      <ToolIconGlyph icon={tool.icon} className={styles.toolIcon} />
      <span>{tool.title}</span>
      {tool.external ? (
        <span className={styles.srOnly}> (opens in new tab)</span>
      ) : null}
    </>
  );

  if (tool.external) {
    return (
      <a
        href={tool.href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={tool.href}
      className={className}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { query, setQuery } = useSearch();
  const filteredCategories = filterCategories(query);
  const isSearching = query.trim().length > 0;
  const isHome = pathname === "/";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.search} role="search">
        <svg
          className={styles.searchIcon}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="7"
            cy="7"
            r="4.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M10.5 10.5L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="tools-search"
          type="search"
          className={styles.searchInput}
          placeholder="Type to search for tools..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search tools"
          aria-controls="tools-navigation"
        />
      </div>

      <nav
        id="tools-navigation"
        className={styles.nav}
        aria-label="Tools navigation"
      >
        <Link
          href="/"
          className={`${styles.navItem} ${isHome ? styles.navItemActive : ""}`}
          aria-current={isHome ? "page" : undefined}
        >
          <svg
            className={styles.homeIcon}
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 6.5L8 2l6 4.5V13a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          All Tools
        </Link>

        {isSearching && filteredCategories.length === 0 ? (
          <p className={styles.empty} role="status" aria-live="polite">
            No tools match &ldquo;{query.trim()}&rdquo;. Try a different search
            term.
          </p>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryLabel}>{category.label}</div>
              <div className={styles.toolList}>
                {category.tools.map((tool) => (
                  <ToolNavItem
                    key={tool.id}
                    tool={tool}
                    isActive={!tool.external && pathname === tool.href}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
}
