import { describe, expect, it } from "vitest";
import {
  apiError,
  apiSuccess,
  parseWordFromRequest,
} from "@/lib/api";
import { MAX_INPUT_LENGTH } from "@/lib/wordEncoder/constants";

describe("api helpers", () => {
  it("returns success envelope", () => {
    const response = apiSuccess("8.5.12.12.15");
    expect(response.status).toBe(200);
  });

  it("returns error envelope with matching status", async () => {
    const response = apiError("Invalid input", 400);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      data: "",
      status: false,
      msg: "Invalid input",
      statusCode: 400,
    });
  });
});

describe("parseWordFromRequest", () => {
  it("parses JSON requests", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "hello" }),
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed).toEqual({ ok: true, word: "hello" });
  });

  it("parses form-urlencoded requests", async () => {
    const body = new URLSearchParams({ word: "hello" });
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed).toEqual({ ok: true, word: "hello" });
  });

  it("rejects missing word", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.statusCode).toBe(400);
    }
  });

  it("rejects non-string word", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: 42 }),
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed.ok).toBe(false);
  });

  it("rejects malformed JSON", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.msg).toMatch(/malformed json/i);
    }
  });

  it("rejects unsupported content types", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "hello",
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.statusCode).toBe(415);
    }
  });

  it("rejects oversized input at validation layer", async () => {
    const request = new Request("http://localhost/initial/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: "a".repeat(MAX_INPUT_LENGTH + 1) }),
    });

    const parsed = await parseWordFromRequest(request);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const { validateConvertInput } = await import("@/lib/validation");
      expect(validateConvertInput(parsed.word).ok).toBe(false);
    }
  });
});
