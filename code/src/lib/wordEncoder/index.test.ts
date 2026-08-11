import { describe, expect, it } from "vitest";
import { convert, revert } from "@/lib/wordEncoder";
import { MAX_INPUT_LENGTH } from "@/lib/wordEncoder/constants";
import {
  validateConvertInput,
  validateRevertInput,
} from "@/lib/validation";

describe("wordEncoder", () => {
  it("encodes hello", () => {
    expect(convert("hello")).toBe("8.5.12.12.15");
  });

  it("decodes hello", () => {
    expect(revert("8.5.12.12.15")).toBe("hello");
  });

  it("round-trips representative inputs", () => {
    const inputs = ["hello", "hello world", " hello", "hello ", "a  b", "A1!"];

    for (const input of inputs) {
      expect(revert(convert(input))).toBe(input);
    }
  });

  it("rejects empty input for convert", () => {
    expect(() => convert("")).toThrow(/empty/i);
  });

  it("rejects empty input for revert", () => {
    expect(() => revert("")).toThrow(/empty/i);
  });

  it("rejects unsupported characters", () => {
    expect(() => convert("hello\tworld")).toThrow(/unsupported/i);
    expect(() => convert("héllo")).toThrow(/unsupported/i);
  });

  it("rejects malformed encoded tokens", () => {
    expect(() => revert("8..5")).toThrow(/malformed/i);
    expect(() => revert("8.")).toThrow(/malformed/i);
  });

  it("rejects negative indexes", () => {
    expect(() => revert("-1.5")).toThrow(/invalid encoded/i);
  });

  it("rejects out-of-range indexes", () => {
    expect(() => revert("999")).toThrow(/out of range/i);
  });

  it("rejects input exceeding maximum length", () => {
    const tooLong = "a".repeat(MAX_INPUT_LENGTH + 1);
    expect(() => convert(tooLong)).toThrow(/maximum length/i);
  });
});

describe("validation", () => {
  it("rejects non-string convert input", () => {
    expect(validateConvertInput(42).ok).toBe(false);
  });

  it("rejects non-string revert input", () => {
    expect(validateRevertInput(null).ok).toBe(false);
  });
});
