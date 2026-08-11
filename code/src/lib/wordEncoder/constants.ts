/**
 * Wire-format charset for Word Encoder.
 *
 * IMPORTANT: The ordering of this string is part of the encoding contract.
 * Changing character order changes the meaning of every previously encoded value.
 * Treat this ordering as immutable unless deliberately migrating the format.
 *
 * Supported characters:
 * - ASCII space (U+0020)
 * - a-z, A-Z, 0-9
 * - punctuation: ".,:;'|/?!@#$%^&*()-_+={}[]<>
 *
 * NOT supported:
 * - Tabs, newlines, or other whitespace
 * - Unicode letters/symbols outside this set
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

/** Conservative URL path + query budget for result redirects. */
export const MAX_RESULT_URL_LENGTH = 2000;
