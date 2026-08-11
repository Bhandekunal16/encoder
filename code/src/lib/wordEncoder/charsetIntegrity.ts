/**
 * Validates wire-format charset invariants at module initialization.
 *
 * Failures here indicate developer/configuration errors, not user input errors.
 */
export function assertCharsetIntegrity(charset: string): void {
  if (charset.length === 0) {
    throw new Error("CHARSET must not be empty");
  }

  const characters = [...charset];
  const uniqueCharacters = new Set(characters);

  if (uniqueCharacters.size !== characters.length) {
    throw new Error("CHARSET must contain unique characters");
  }

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i]!;

    if (char.length !== 1) {
      throw new Error(
        `CHARSET entry at index ${i} must be a single Unicode code unit`,
      );
    }

    const codeUnit = char.charCodeAt(0);

    if (codeUnit >= 0xd800 && codeUnit <= 0xdfff) {
      throw new Error(
        `CHARSET entry at index ${i} must not be a surrogate code unit`,
      );
    }
  }
}
