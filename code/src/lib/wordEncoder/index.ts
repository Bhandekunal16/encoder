import {
  CHARSET,
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
} from "./constants";
import { WordEncoderError } from "./errors";

export { CHARSET, MAX_ENCODED_LENGTH, MAX_INPUT_LENGTH, MAX_RESULT_URL_LENGTH } from "./constants";
export { WordEncoderError, type WordEncoderErrorCode } from "./errors";

export function isSupportedCharacter(char: string): boolean {
  return char.length === 1 && CHARSET.includes(char);
}

export function convert(input: string): string {
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
    const char = input[i];
    const index = CHARSET.indexOf(char);

    if (index === -1) {
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

export function revert(input: string): string {
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

  const result = new Array<string>(values.length);

  for (let i = 0; i < values.length; i++) {
    const token = values[i];

    if (!/^\d+$/.test(token)) {
      throw new WordEncoderError(
        `Invalid encoded token: ${JSON.stringify(token)}`,
        "InvalidEncodedToken",
      );
    }

    const index = Number(token);

    if (!Number.isInteger(index) || index < 0) {
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

    result[i] = CHARSET[index]!;
  }

  return result.join("");
}
