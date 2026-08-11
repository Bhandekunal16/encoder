import toolsConfig from "@/core/json/tools.config.json";
import type { Tool, ToolsConfig } from "@/types/tools";

const config = toolsConfig as ToolsConfig;

export function getToolCategories() {
  return config.categories;
}

export function getAllTools(): Tool[] {
  return config.categories.flatMap((category) => category.tools);
}

function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function filterTools(tools: Tool[], query: string): Tool[] {
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return tools;
  }

  return tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(normalized) ||
      tool.description.toLowerCase().includes(normalized),
  );
}

export function filterCategories(query: string) {
  const normalized = normalizeSearchQuery(query);

  if (!normalized) {
    return config.categories;
  }

  return config.categories
    .map((category) => {
      const categoryMatches = category.label.toLowerCase().includes(normalized);

      return {
        ...category,
        tools: categoryMatches
          ? [...category.tools]
          : filterTools(category.tools, query),
      };
    })
    .filter((category) => category.tools.length > 0);
}
