import {
  decode,
  encode,
  WordEncoderError,
  type WordEncoderErrorCode,
} from "@/lib/wordEncoder";

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
    encode(input);
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
    decode(input);
    return { ok: true, value: input };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return fromEncoderError(error);
    }
    throw error;
  }
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
