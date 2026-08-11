export type ToolIcon = "encode" | "decode" | "api" | "npm";

export type Tool = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ToolIcon;
  external?: boolean;
};

export type ToolCategory = {
  id: string;
  label: string;
  tools: Tool[];
};

export type ToolsConfig = {
  categories: ToolCategory[];
};
