/**
 * Wire-format charset for Word Encoder.
 *
 * COMPATIBILITY CONTRACT (persistence / URLs / caches / cross-version decoding):
 * Backward-compatible decoding requires all of the following to remain unchanged:
 * - this exact character ordering
 * - `.` as the sole token separator
 * - canonical non-negative integer token semantics
 *
 * Changing CHARSET ordering is a breaking format change. Do not reorder, add, or
 * remove characters without a deliberate migration plan. Encoded values stored in
 * databases, URLs, or caches depend on this ordering.
 *
 * Supported characters:
 * - ASCII space (U+0020)
 * - a-z, A-Z, 0-9
 * - punctuation: ".,:;'|/?!@#$%^&*()-_+={}[]<
 *
 * NOT supported:
 * - Tabs, newlines, or other whitespace
 * - Unicode letters/symbols outside this set
 *
 * Unicode semantics:
 * CHARSET contains only BMP characters that occupy a single UTF-16 code unit.
 * Encoding and decoding iterate by code unit (`input[i]`), not by Unicode code point.
 * Surrogate pairs and combining characters are intentionally unsupported.
 * Input is never normalized (NFC/NFD/NFKC/NFKD).
 */
export const CHARSET =
  ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".,:;'|/?!@#$%^&*()-_+={}[]<>0123456789`;

/** Maximum plaintext input length (characters). */
export const MAX_INPUT_LENGTH = 500;

/**
 * Maximum encoded output length (characters).
 * Keeps `?ans=` query strings within a safe browser URL limit (~2 KB).
 */
export const MAX_ENCODED_LENGTH = 1500;

/** Canonical numeric token: `0` or a non-zero-leading positive integer. */
export const CANONICAL_TOKEN_PATTERN = /^(0|[1-9]\d*)$/;
