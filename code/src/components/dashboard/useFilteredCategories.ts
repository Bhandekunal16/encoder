"use client";

import { filterCategories } from "@/lib/tools";
import type { ToolCategory } from "@/types/tools";
import { useSearch } from "./SearchContext";

type UseFilteredCategoriesResult = {
  categories: ToolCategory[];
  isSearching: boolean;
};

export function useFilteredCategories(): UseFilteredCategoriesResult {
  const { query } = useSearch();
  const isSearching = query.trim().length > 0;

  return {
    categories: filterCategories(query),
    isSearching,
  };
}
