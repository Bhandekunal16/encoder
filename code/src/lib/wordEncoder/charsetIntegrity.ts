const SURROGATE_MIN = 0xd800;
const SURROGATE_MAX = 0xdfff;
const BMP_MAX_CODE_POINT = 0xffff;

export function parseCharsetEntries(charset: string): readonly string[] {
  if (charset.length === 0) throw new Error("CHARSET must not be empty");

  const entries = [...charset];
  const seen = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!;
    const codePoint = entry.codePointAt(0);

    if (codePoint === undefined)
      throw new Error(
        `CHARSET entry at index ${i} must contain a valid Unicode code point`,
      );

    if (codePoint >= SURROGATE_MIN && codePoint <= SURROGATE_MAX)
      throw new Error(
        `CHARSET entry at index ${i} must not be a surrogate code point`,
      );

    if (codePoint > BMP_MAX_CODE_POINT)
      throw new Error(
        `CHARSET entry at index ${i} must be a BMP character (U+0000–U+FFFF)`,
      );

    if (seen.has(entry))
      throw new Error("CHARSET must contain unique Unicode code points");

    seen.add(entry);
  }

  return entries;
}

export function assertCharsetIntegrity(charset: string): void {
  parseCharsetEntries(charset);
}
