import { describe, expect, it } from "vitest";
import {
  filterCategories,
  filterTools,
  getAllTools,
  getToolCategories,
} from "@/lib/tools";

describe("filterTools", () => {
  const tools = getAllTools();

  it("returns all tools for an empty query", () => {
    expect(filterTools(tools, "")).toBe(tools);
    expect(filterTools(tools, "   ")).toBe(tools);
  });

  it("matches title and description case-insensitively", () => {
    expect(filterTools(tools, "encoder")).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "word-encoder" }),
        expect.objectContaining({ id: "npm-package" }),
      ]),
    );
    expect(filterTools(tools, "DECODE")).toEqual([
      expect.objectContaining({ id: "word-decoder" }),
    ]);
    expect(filterTools(tools, "node")).toEqual([
      expect.objectContaining({ id: "npm-package" }),
    ]);
  });

  it("does not mutate the source array", () => {
    const snapshot = [...tools];
    filterTools(tools, "api");
    expect(tools).toEqual(snapshot);
  });
});

describe("filterCategories", () => {
  const categories = getToolCategories();

  it("returns the original categories for an empty query", () => {
    expect(filterCategories("")).toBe(categories);
    expect(filterCategories("   ")).toBe(categories);
  });

  it("preserves category and tool ordering", () => {
    const filtered = filterCategories("e");

    expect(filtered.map((category) => category.id)).toEqual([
      "encoder-decoder",
      "integration",
    ]);
    expect(filtered[0]?.tools.map((tool) => tool.id)).toEqual([
      "word-encoder",
      "word-decoder",
    ]);
  });

  it("returns only categories with matching tools", () => {
    expect(filterCategories("npm").map((category) => category.id)).toEqual([
      "integration",
    ]);
    expect(filterCategories("word encoder").map((category) => category.id)).toEqual(
      ["encoder-decoder"],
    );
  });

  it("matches category labels and includes all tools in that category", () => {
    const filtered = filterCategories("integration");

    expect(filtered).toHaveLength(1);
    expect(filtered[0]).toMatchObject({ id: "integration" });
    expect(filtered[0]?.tools.map((tool) => tool.id)).toEqual([
      "api-guide",
      "npm-package",
    ]);
  });

  it("supports partial matches across tool fields", () => {
    expect(filterCategories("prog")).toEqual([
      expect.objectContaining({
        tools: [expect.objectContaining({ id: "api-guide" })],
      }),
    ]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterCategories("zzzz-not-found")).toEqual([]);
  });

  it("does not mutate the original category data", () => {
    const snapshot = structuredClone(categories);
    filterCategories("api");
    expect(categories).toEqual(snapshot);
  });
});
