import {
  CANONICAL_TOKEN_PATTERN,
  CHARSET,
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
} from "./constants";
import { assertCharsetIntegrity } from "./charsetIntegrity";
import { MAX_SAFE_INTEGER_DIGIT_COUNT } from "./limits";
import { WordEncoderError } from "./errors";

export {
  CANONICAL_TOKEN_PATTERN,
  CHARSET,
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_RESULT_URL_LENGTH,
} from "./constants";
export {
  MAX_CHAR_INDEX,
  MAX_SAFE_INTEGER_DIGIT_COUNT,
  MAX_TOKEN_LENGTH,
  THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT,
  theoreticalMaxEncodedLength,
} from "./limits";
export { WordEncoderError, type WordEncoderErrorCode } from "./errors";

assertCharsetIntegrity(CHARSET);

const CHAR_TO_INDEX = new Map<string, number>(
  [...CHARSET].map((char, index) => [char, index]),
);

function parseCanonicalToken(token: string): number {
  if (!CANONICAL_TOKEN_PATTERN.test(token)) {
    throw new WordEncoderError(
      `Invalid encoded token: ${JSON.stringify(token)}`,
      "InvalidEncodedToken",
    );
  }

  if (token.length > MAX_SAFE_INTEGER_DIGIT_COUNT) {
    throw new WordEncoderError(
      `Invalid encoded index: ${JSON.stringify(token)}`,
      "InvalidEncodedToken",
    );
  }

  const index = Number(token);

  if (!Number.isSafeInteger(index) || index < 0) {
    throw new WordEncoderError(
      `Invalid encoded index: ${JSON.stringify(token)}`,
      "InvalidEncodedToken",
    );
  }

  if (index >= CHARSET.length) {
    throw new WordEncoderError(
      `Encoded index out of range: ${index}`,
      "EncodedIndexOutOfRange",
    );
  }

  return index;
}

function validateEncodedInput(input: string): number[] {
  if (input.length === 0) {
    throw new WordEncoderError("Input cannot be empty", "EmptyInput");
  }

  if (input.length > MAX_ENCODED_LENGTH) {
    throw new WordEncoderError(
      `Encoded input exceeds maximum length of ${MAX_ENCODED_LENGTH} characters`,
      "InputTooLong",
    );
  }

  const values = input.split(".");

  if (values.length === 0 || values.some((token) => token.length === 0)) {
    throw new WordEncoderError(
      "Malformed encoded input",
      "InvalidEncodedToken",
    );
  }

  const indexes = new Array<number>(values.length);

  for (let i = 0; i < values.length; i++) {
    indexes[i] = parseCanonicalToken(values[i]!);
  }

  return indexes;
}

export function isSupportedCharacter(char: string): boolean {
  return char.length === 1 && CHAR_TO_INDEX.has(char);
}

/**
 * Returns whether `input` is a valid canonical encoded representation.
 * Does not throw; invalid inputs return `false`.
 */
export function isValidEncoded(input: string): boolean {
  try {
    validateEncodedInput(input);
    return true;
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return false;
    }

    throw error;
  }
}

export function encode(input: string): string {
  if (input.length === 0) {
    throw new WordEncoderError("Input cannot be empty", "EmptyInput");
  }

  if (input.length > MAX_INPUT_LENGTH) {
    throw new WordEncoderError(
      `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
      "InputTooLong",
    );
  }

  const result = new Array<string>(input.length);

  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    const index = CHAR_TO_INDEX.get(char);

    if (index === undefined) {
      throw new WordEncoderError(
        `Unsupported character: ${JSON.stringify(char)}`,
        "UnsupportedCharacter",
      );
    }

    result[i] = String(index);
  }

  const encoded = result.join(".");

  if (encoded.length > MAX_ENCODED_LENGTH) {
    throw new WordEncoderError(
      `Encoded output exceeds maximum length of ${MAX_ENCODED_LENGTH} characters`,
      "InputTooLong",
    );
  }

  return encoded;
}

/**
 * Decode a dot-separated sequence of canonical numeric charset indexes.
 *
 * Delimiter semantics: `.` is exclusively a token separator, never a decimal
 * point. For example, `"1.5"` decodes to `CHARSET[1] + CHARSET[5]` (two
 * characters), not a fractional value.
 */
export function decode(input: string): string {
  const indexes = validateEncodedInput(input);
  const result = new Array<string>(indexes.length);

  for (let i = 0; i < indexes.length; i++) {
    result[i] = CHARSET[indexes[i]!]!;
  }

  return result.join("");
}

/** @deprecated Use {@link encode} instead. */
export const convert = encode;

/** @deprecated Use {@link decode} instead. */
export const revert = decode;
