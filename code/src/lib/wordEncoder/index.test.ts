import { describe, expect, it, vi } from "vitest";
import {
  CANONICAL_TOKEN_PATTERN,
  CHARSET,
  MAX_CHAR_INDEX,
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_TOKEN_LENGTH,
  THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT,
  theoreticalMaxEncodedLength,
} from "@/lib/wordEncoder";
import {
  convert,
  decode,
  encode,
  isValidEncoded,
  revert,
  WordEncoderError,
} from "@/lib/wordEncoder";
import { assertCharsetIntegrity, parseCharsetEntries } from "@/lib/wordEncoder/charsetIntegrity";
import {
  validateConvertInput,
  validateRevertInput,
} from "@/lib/validation";

function expectEncoderError(
  fn: () => unknown,
  code: WordEncoderError["code"],
): void {
  try {
    fn();
    expect.unreachable("Expected WordEncoderError to be thrown");
  } catch (error) {
    expect(error).toBeInstanceOf(WordEncoderError);
    expect((error as WordEncoderError).code).toBe(code);
  }
}

function randomCharsetString(length: number): string {
  let value = "";

  for (let i = 0; i < length; i++) {
    value += CHARSET[Math.floor(Math.random() * CHARSET.length)]!;
  }

  return value;
}

function buildZeroTokenEncoded(tokenCount: number): string {
  return Array.from({ length: tokenCount }, () => "0").join(".");
}

describe("wordEncoder", () => {
  describe("charset integrity and derived metadata", () => {
    it("uses a 92-character charset", () => {
      expect(CHARSET.length).toBe(92);
      expect(MAX_CHAR_INDEX).toBe(91);
      expect(MAX_TOKEN_LENGTH).toBe(2);
    });

    it("keeps charset entry count aligned with the BMP string length", () => {
      expect(parseCharsetEntries(CHARSET).length).toBe(CHARSET.length);
    });

    it("rejects duplicate charset characters", () => {
      expect(() => assertCharsetIntegrity("aa")).toThrow(
        /unique Unicode code points/i,
      );
    });

    it("rejects surrogate code units in charset", () => {
      expect(() => assertCharsetIntegrity("\uD800")).toThrow(/surrogate/i);
    });

    it("derives worst-case encoded length from the live charset", () => {
      expect(theoreticalMaxEncodedLength(MAX_INPUT_LENGTH)).toBe(
        MAX_INPUT_LENGTH * MAX_TOKEN_LENGTH + (MAX_INPUT_LENGTH - 1),
      );
      expect(THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT).toBe(1499);
      expect(THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT).toBeLessThan(
        MAX_ENCODED_LENGTH,
      );
    });

    it("keeps MAX_ENCODED_LENGTH as a defensive upper bound above theory", () => {
      expect(MAX_ENCODED_LENGTH).toBe(1500);
      expect(THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT).toBe(
        MAX_ENCODED_LENGTH - 1,
      );
    });
  });

  describe("charset mapping invariants", () => {
    it("maps every charset position to its canonical index token", () => {
      const entries = parseCharsetEntries(CHARSET);

      for (let i = 0; i < entries.length; i++) {
        const char = entries[i]!;

        expect(encode(char)).toBe(String(i));
        expect(decode(String(i))).toBe(char);
      }
    });
  });

  describe("isValidEncoded", () => {
    it.each([
      ["0.1.2", true],
      ["1.5", true],
      ["91", true],
      ["01", false],
      ["001", false],
      ["1..2", false],
      [".1", false],
      ["1.", false],
      ["abc", false],
      ["-1", false],
      ["", false],
      [String(CHARSET.length), false],
    ] as const)("isValidEncoded(%j) === %s", (input, expected) => {
      expect(isValidEncoded(input)).toBe(expected);
    });

    it("rejects encoded input longer than MAX_ENCODED_LENGTH", () => {
      expect(isValidEncoded("0".repeat(MAX_ENCODED_LENGTH + 1))).toBe(false);
    });
  });

  describe("canonical encoding stability", () => {
    it("re-encodes valid encoded strings to the same canonical form", () => {
      const encodedSamples = [
        "0",
        "1.5",
        "0.1.2",
        "8.5.12.12.15",
        encode("a".repeat(MAX_INPUT_LENGTH)),
        encode(CHARSET[CHARSET.length - 1]!.repeat(MAX_INPUT_LENGTH)),
      ];

      for (const encoded of encodedSamples) {
        expect(encode(decode(encoded))).toBe(encoded);
      }
    });

    it("stabilizes canonical forms across 200 random valid encodings", () => {
      for (let trial = 0; trial < 200; trial++) {
        const input = randomCharsetString(
          Math.floor(Math.random() * MAX_INPUT_LENGTH) + 1,
        );
        const encoded = encode(input);
        expect(encode(decode(encoded))).toBe(encoded);
      }
    });
  });

  describe("encode / decode aliases", () => {
    it("exposes convert and revert as aliases", () => {
      expect(convert).toBe(encode);
      expect(revert).toBe(decode);
    });
  });

  describe("encoded length limits", () => {
    it("verifies worst-case encoded length mathematically", () => {
      const maxIndex = CHARSET.length - 1;
      const maxTokenDigits = String(maxIndex).length;
      const expectedWorstCase = MAX_INPUT_LENGTH * maxTokenDigits + (MAX_INPUT_LENGTH - 1);

      expect(theoreticalMaxEncodedLength(MAX_INPUT_LENGTH)).toBe(expectedWorstCase);
      expect(theoreticalMaxEncodedLength(MAX_INPUT_LENGTH)).toBeLessThanOrEqual(
        MAX_ENCODED_LENGTH,
      );
    });

    it("accepts maximum-length plaintext without false rejection", () => {
      const worstChar = CHARSET[CHARSET.length - 1]!;
      const maxInput = worstChar.repeat(MAX_INPUT_LENGTH);
      const encoded = encode(maxInput);

      expect(encoded.length).toBe(theoreticalMaxEncodedLength(MAX_INPUT_LENGTH));
      expect(encoded.length).toBeLessThanOrEqual(MAX_ENCODED_LENGTH);
      expect(decode(encoded)).toBe(maxInput);
    });

    it("rejects encoded output exceeding MAX_ENCODED_LENGTH", async () => {
      vi.resetModules();
      vi.doMock("./constants", async () => {
        const actual = await vi.importActual<typeof import("./constants")>(
          "./constants",
        );
        return { ...actual, MAX_ENCODED_LENGTH: 10 };
      });

      const { encode: limitedEncode } = await import("./index");
      expect(() => limitedEncode("hello")).toThrow(/maximum length/i);

      vi.doUnmock("./constants");
      vi.resetModules();
    });
  });

  describe("plaintext input boundaries", () => {
    it("accepts MAX_INPUT_LENGTH - 1", () => {
      const input = "a".repeat(MAX_INPUT_LENGTH - 1);
      expect(encode(input).length).toBeGreaterThan(0);
      expect(decode(encode(input))).toBe(input);
    });

    it("accepts MAX_INPUT_LENGTH", () => {
      const input = "a".repeat(MAX_INPUT_LENGTH);
      expect(decode(encode(input))).toBe(input);
    });

    it("rejects MAX_INPUT_LENGTH + 1", () => {
      const input = "a".repeat(MAX_INPUT_LENGTH + 1);
      expectEncoderError(() => encode(input), "InputTooLong");
    });
  });

  describe("encoded input boundaries", () => {
    it("accepts encoded input of length MAX_ENCODED_LENGTH - 1", () => {
      const encoded = buildZeroTokenEncoded(750);
      expect(encoded.length).toBe(MAX_ENCODED_LENGTH - 1);
      expect(decode(encoded)).toBe(CHARSET[0]!.repeat(750));
    });

    it("cannot construct a valid encoded string of length MAX_ENCODED_LENGTH", () => {
      const worstCase = encode(CHARSET[MAX_CHAR_INDEX]!.repeat(MAX_INPUT_LENGTH));
      expect(worstCase.length).toBe(THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT);
      expect(worstCase.length).toBe(MAX_ENCODED_LENGTH - 1);
      expect(isValidEncoded(worstCase)).toBe(true);
      expect(isValidEncoded(`${worstCase}0`)).toBe(false);
    });

    it("rejects encoded input of length MAX_ENCODED_LENGTH + 1", () => {
      const tooLong = "0".repeat(MAX_ENCODED_LENGTH + 1);
      expectEncoderError(() => decode(tooLong), "InputTooLong");
    });
  });

  describe("charset index boundaries", () => {
    it("decodes index 0", () => {
      expect(decode("0")).toBe(CHARSET[0]);
    });

    it("decodes index CHARSET.length - 1", () => {
      const lastIndex = CHARSET.length - 1;
      expect(decode(String(lastIndex))).toBe(CHARSET[lastIndex]);
    });

    it("rejects index CHARSET.length", () => {
      expectEncoderError(
        () => decode(String(CHARSET.length)),
        "EncodedIndexOutOfRange",
      );
    });
  });

  describe("delimiter semantics", () => {
    it('treats "." as a token separator, not a decimal point', () => {
      expect(decode("1")).toBe(CHARSET[1]);
      expect(decode("1.5")).toBe(`${CHARSET[1]}${CHARSET[5]}`);
      expect(decode("1.5.10")).toBe(`${CHARSET[1]}${CHARSET[5]}${CHARSET[10]}`);
      expect(decode("0.1.2")).toBe(`${CHARSET[0]}${CHARSET[1]}${CHARSET[2]}`);
    });
  });

  describe("unicode behavior", () => {
    const unsupportedSamples: Array<{ label: string; input: string }> = [
      { label: "emoji", input: "😀" },
      { label: "accented e", input: "é" },
      { label: "spanish n", input: "ñ" },
      { label: "cjk", input: "中" },
      { label: "devanagari", input: "अ" },
      { label: "combining acute", input: "e\u0301" },
      { label: "high surrogate alone", input: "\uD800" },
      { label: "emoji sequence", input: "\uD83D\uDE00" },
    ];

    it.each(unsupportedSamples)(
      "rejects unsupported unicode ($label)",
      ({ input }) => {
        expectEncoderError(() => encode(input), "UnsupportedCharacter");
      },
    );

    it("does not partially encode surrogate-pair strings", () => {
      const emoji = "\uD83D\uDE00";
      expect(emoji.length).toBe(2);
      expectEncoderError(() => encode(emoji), "UnsupportedCharacter");
    });
  });

  describe("numeric token hardening", () => {
    it.each([
      ["999999999999999999999999999999999999", "InvalidEncodedToken"],
      ["9007199254740991", "EncodedIndexOutOfRange"],
      ["9007199254740992", "InvalidEncodedToken"],
      [String(CHARSET.length - 1), null],
      [String(CHARSET.length), "EncodedIndexOutOfRange"],
      [String(CHARSET.length + 1), "EncodedIndexOutOfRange"],
    ] as const)("handles token %s", (token, code) => {
      if (code === null) {
        expect(decode(token)).toBe(CHARSET[CHARSET.length - 1]);
        return;
      }

      expectEncoderError(() => decode(token), code);
    });

    it("rejects tokens longer than MAX_SAFE_INTEGER digit count before precision loss", () => {
      const hugeToken = "9".repeat(400);
      expect(hugeToken.length).toBeGreaterThan(16);
      expectEncoderError(() => decode(hugeToken), "InvalidEncodedToken");
    });

    it("rejects unsafe integers without native exceptions", () => {
      const unsafeToken = "9007199254740993";
      expect(Number.isSafeInteger(Number(unsafeToken))).toBe(false);
      expect(() => decode(unsafeToken)).not.toThrow(TypeError);
      expectEncoderError(() => decode(unsafeToken), "InvalidEncodedToken");
    });
  });

  describe("malformed input robustness", () => {
    const invalidCases: Array<{ input: string; code: WordEncoderError["code"] }> = [
      { input: "", code: "EmptyInput" },
      { input: ".", code: "InvalidEncodedToken" },
      { input: ".1", code: "InvalidEncodedToken" },
      { input: "1.", code: "InvalidEncodedToken" },
      { input: "1..2", code: "InvalidEncodedToken" },
      { input: "...", code: "InvalidEncodedToken" },
      { input: "abc", code: "InvalidEncodedToken" },
      { input: "a.1", code: "InvalidEncodedToken" },
      { input: "1.a", code: "InvalidEncodedToken" },
      { input: "-1", code: "InvalidEncodedToken" },
      { input: "+1", code: "InvalidEncodedToken" },
      { input: "01", code: "InvalidEncodedToken" },
      { input: "001", code: "InvalidEncodedToken" },
      { input: "0001", code: "InvalidEncodedToken" },
    ];

    it.each(invalidCases)(
      'rejects malformed input "$input" with $code',
      ({ input, code }) => {
        expect(() => decode(input)).not.toThrow(TypeError);
        expectEncoderError(() => decode(input), code);
      },
    );

    it('accepts "1.5" as two token indexes, not a decimal', () => {
      expect(decode("1.5")).toBe(`${CHARSET[1]}${CHARSET[5]}`);
    });
  });

  describe("round-trip correctness", () => {
    it("round-trips representative inputs", () => {
      const inputs = [
        "A",
        "HELLO",
        "ABC123",
        "hello",
        "hello world",
        " hello",
        "hello ",
        "a  b",
        "A1!",
      ];

      for (const input of inputs) {
        expect(decode(encode(input))).toBe(input);
      }
    });

    it("round-trips every character in CHARSET", () => {
      for (const char of parseCharsetEntries(CHARSET)) {
        expect(decode(encode(char))).toBe(char);
      }
    });

    it("round-trips maximum allowed input length", () => {
      const input = "a".repeat(MAX_INPUT_LENGTH);
      expect(decode(encode(input))).toBe(input);
    });
  });

  describe("property-style fuzz testing", () => {
    it("round-trips single-character strings", () => {
      for (const char of parseCharsetEntries(CHARSET)) {
        expect(decode(encode(char))).toBe(char);
      }
    });

    it("round-trips repeated-character strings", () => {
      for (const char of ["a", " ", "9", CHARSET[CHARSET.length - 1]!]) {
        const input = char.repeat(120);
        expect(decode(encode(input))).toBe(input);
      }
    });

    it("round-trips maximum-length strings", () => {
      const input = randomCharsetString(MAX_INPUT_LENGTH);
      expect(decode(encode(input))).toBe(input);
    });

    it("round-trips 500 pseudo-random valid strings", () => {
      for (let trial = 0; trial < 500; trial++) {
        const length = Math.floor(Math.random() * MAX_INPUT_LENGTH) + 1;
        const input = randomCharsetString(length);
        expect(decode(encode(input))).toBe(input);
      }
    });
  });

  describe("encode", () => {
    it("encodes hello", () => {
      expect(encode("hello")).toBe("8.5.12.12.15");
    });

    it("rejects empty input", () => {
      expectEncoderError(() => encode(""), "EmptyInput");
    });

    it("rejects unsupported characters", () => {
      expectEncoderError(() => encode("hello\tworld"), "UnsupportedCharacter");
      expectEncoderError(() => encode("héllo"), "UnsupportedCharacter");
    });

    it("accepts canonical zero token pattern", () => {
      expect(CANONICAL_TOKEN_PATTERN.test("0")).toBe(true);
    });
  });

  describe("decode", () => {
    it("decodes hello", () => {
      expect(decode("8.5.12.12.15")).toBe("hello");
    });

    it("rejects empty input", () => {
      expectEncoderError(() => decode(""), "EmptyInput");
    });
  });
});

describe("validation", () => {
  it("rejects non-string convert input", () => {
    expect(validateConvertInput(42).ok).toBe(false);
  });

  it("rejects non-string revert input", () => {
    expect(validateRevertInput(null).ok).toBe(false);
  });

  it("rejects non-canonical encoded input through validateRevertInput", () => {
    const result = validateRevertInput("01");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.code).toBe("InvalidEncodedToken");
    }
  });
});
