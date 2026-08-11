import { CHARSET, MAX_ENCODED_LENGTH, MAX_INPUT_LENGTH } from "./constants";

/** Highest valid charset index derived from the live charset. */
export const MAX_CHAR_INDEX = CHARSET.length - 1;

/** Maximum digit count for a canonical index token derived from the live charset. */
export const MAX_TOKEN_LENGTH = String(MAX_CHAR_INDEX).length;

/**
 * Worst-case encoded length for a plaintext of `plaintextLength` characters.
 *
 * Formula: each index token uses at most `MAX_TOKEN_LENGTH` characters and
 * tokens are joined by single `.` separators.
 *
 *   maxEncoded = n * MAX_TOKEN_LENGTH + (n - 1)
 */
export function theoreticalMaxEncodedLength(plaintextLength: number): number {
  if (plaintextLength <= 0) {
    return 0;
  }

  return plaintextLength * MAX_TOKEN_LENGTH + (plaintextLength - 1);
}

/**
 * Theoretical worst-case encoded length for {@link MAX_INPUT_LENGTH} characters.
 * For the current charset this is 1499; {@link MAX_ENCODED_LENGTH} remains a
 * defensive configured upper bound.
 */
export const THEORETICAL_MAX_ENCODED_LENGTH_FOR_MAX_INPUT =
  theoreticalMaxEncodedLength(MAX_INPUT_LENGTH);

/** Digit count above which no JavaScript safe integer can be represented. */
export const MAX_SAFE_INTEGER_DIGIT_COUNT = String(Number.MAX_SAFE_INTEGER).length;

export function isEncodedLengthWithinLimit(encodedLength: number): boolean {
  return encodedLength <= MAX_ENCODED_LENGTH;
}

export function isPlaintextLengthWithinLimit(plaintextLength: number): boolean {
  return plaintextLength > 0 && plaintextLength <= MAX_INPUT_LENGTH;
}

export {
  CHARSET,
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
} from "./constants";
