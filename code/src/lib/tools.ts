import toolsConfig from "@/core/json/tools.config.json";
import type { Tool, ToolsConfig } from "@/types/tools";

const config = toolsConfig as ToolsConfig;

export function getToolCategories() {
  return config.categories;
}

export function getAllTools(): Tool[] {
  return config.categories.flatMap((category) => category.tools);
}

export function filterTools(tools: Tool[], query: string): Tool[] {
  const normalized = query.trim().toLowerCase();

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
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return config.categories;
  }

  return config.categories
    .map((category) => ({
      ...category,
      tools: filterTools(category.tools, query),
    }))
    .filter((category) => category.tools.length > 0);
}
