import { describe, expect, it } from "vitest";
import {
  assertCharsetIntegrity,
  parseCharsetEntries,
} from "@/lib/wordEncoder/charsetIntegrity";

describe("parseCharsetEntries", () => {
  describe("valid charsets", () => {
    it.each([
      ["abc", ["a", "b", "c"]],
      ["abc123", ["a", "b", "c", "1", "2", "3"]],
      ["é", ["é"]],
      ["你好", ["你", "好"]],
    ])("accepts %j", (charset, expected) => {
      expect(parseCharsetEntries(charset)).toEqual(expected);
      expect(() => assertCharsetIntegrity(charset)).not.toThrow();
    });
  });

  describe("invalid charsets", () => {
    it("rejects an empty charset", () => {
      expect(() => parseCharsetEntries("")).toThrow(/must not be empty/i);
    });

    it("rejects duplicate code points", () => {
      expect(() => parseCharsetEntries("aabc")).toThrow(
        /unique Unicode code points/i,
      );
    });

    it("rejects a lone high surrogate", () => {
      expect(() => parseCharsetEntries("\uD800")).toThrow(/surrogate code point/i);
    });

    it("rejects a lone low surrogate", () => {
      expect(() => parseCharsetEntries("\uDFFF")).toThrow(/surrogate code point/i);
    });

    it("rejects a valid surrogate pair as a supplementary code point", () => {
      // JavaScript combines \uD800\uDFFF into one supplementary code point (U+103FF).
      expect(() => parseCharsetEntries("\uD800\uDFFF")).toThrow(/BMP character/i);
    });

    it("rejects a high surrogate followed by a BMP character", () => {
      expect(() => parseCharsetEntries("\uD800a")).toThrow(/surrogate code point/i);
    });
  });

  describe("supplementary code points (BMP-only contract)", () => {
    it.each([
      ["😀", "emoji"],
      ["𝌆", "mathematical alphanumeric"],
      ["𐐷", "deseret"],
      ["a😀b", "mixed BMP and supplementary"],
    ])("rejects %s (%s)", (charset) => {
      expect(() => parseCharsetEntries(charset)).toThrow(/BMP character/i);
    });

    it("does not reject supplementary code points via char.length checks", () => {
      // Regression: a valid supplementary code point must not fail because its
      // UTF-16 representation spans two code units.
      expect(() => parseCharsetEntries("😀")).toThrow(/BMP character/i);
      expect(() => parseCharsetEntries("😀")).not.toThrow(/code unit/i);
    });
  });
});
