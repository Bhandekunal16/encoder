export type WordEncoderErrorCode =
  | "EmptyInput"
  | "InputTooLong"
  | "EncodedOutputTooLong"
  | "UnsupportedCharacter"
  | "InvalidEncodedToken"
  | "EncodedIndexOutOfRange"
  | "InvalidInputType";

export class WordEncoderError extends Error {
  readonly code: WordEncoderErrorCode;

  constructor(message: string, code: WordEncoderErrorCode) {
    super(message);
    this.name = "WordEncoderError";
    this.code = code;
  }
}
