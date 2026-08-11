import {
  convert,
  revert,
  WordEncoderError,
  type WordEncoderErrorCode,
  isSupportedCharacter,
} from "@/lib/wordEncoder";
import {
  MAX_ENCODED_LENGTH,
  MAX_INPUT_LENGTH,
  MAX_RESULT_URL_LENGTH,
} from "@/lib/wordEncoder/constants";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; code: WordEncoderErrorCode; message: string };

function failure(
  code: WordEncoderErrorCode,
  message: string,
): ValidationResult<never> {
  return { ok: false, code, message };
}

function fromEncoderError(error: WordEncoderError): ValidationResult<never> {
  return { ok: false, code: error.code, message: error.message };
}

/** Shared contract for plaintext input (convert / encode). */
export function validateConvertInput(input: unknown): ValidationResult<string> {
  if (typeof input !== "string") {
    return failure("InvalidInputType", "Input must be a string");
  }

  try {
    convert(input);
    return { ok: true, value: input };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return fromEncoderError(error);
    }
    throw error;
  }
}

/** Shared contract for encoded input (revert / decode). */
export function validateRevertInput(input: unknown): ValidationResult<string> {
  if (typeof input !== "string") {
    return failure("InvalidInputType", "Input must be a string");
  }

  try {
    revert(input);
    return { ok: true, value: input };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return fromEncoderError(error);
    }
    throw error;
  }
}

/** Validate encoded `?ans=` values shown on `/convert`. */
export function validateEncodedResult(input: unknown): ValidationResult<string> {
  return validateRevertInput(input);
}

/** Validate plaintext `?ans=` values shown on `/revert`. */
export function validatePlaintextResult(input: unknown): ValidationResult<string> {
  if (typeof input !== "string") {
    return failure("InvalidInputType", "Result must be a string");
  }

  if (input.length === 0) {
    return failure("EmptyInput", "Input cannot be empty");
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return failure(
      "InputTooLong",
      `Input exceeds maximum length of ${MAX_INPUT_LENGTH} characters`,
    );
  }

  for (const char of input) {
    if (!isSupportedCharacter(char)) {
      return failure(
        "UnsupportedCharacter",
        `Unsupported character: ${JSON.stringify(char)}`,
      );
    }
  }

  return { ok: true, value: input };
}

/** Validate API `word` field before route-specific processing. */
export function validateApiWord(input: unknown): ValidationResult<string> {
  if (input === undefined || input === null) {
    return failure("EmptyInput", "word is required");
  }

  if (typeof input !== "string") {
    return failure("InvalidInputType", "word must be a string");
  }

  return { ok: true, value: input };
}

export function encoderErrorToMessage(code: WordEncoderErrorCode): string {
  switch (code) {
    case "EmptyInput":
      return "Input cannot be empty";
    case "InputTooLong":
      return "Input is too long";
    case "UnsupportedCharacter":
      return "Input contains unsupported characters";
    case "InvalidEncodedToken":
      return "Malformed encoded input";
    case "EncodedIndexOutOfRange":
      return "Encoded index is out of range";
    case "InvalidInputType":
      return "Invalid input type";
    default:
      return "Invalid input";
  }
}

export function isSafeResultRedirect(path: string, encodedAnswer: string): boolean {
  const url = `${path}?ans=${encodeURIComponent(encodedAnswer)}`;
  return url.length <= MAX_RESULT_URL_LENGTH;
}
