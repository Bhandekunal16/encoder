"use server";

import { encode, decode, WordEncoderError } from "@/lib/wordEncoder";
import {
  encoderErrorToMessage,
  validateConvertInput,
  validateRevertInput,
} from "@/lib/validation";
import { logServerError } from "@/lib/logger";
import type { WordActionState } from "@/types/actions";

export async function convertWord(
  _prevState: WordActionState,
  formData: FormData,
): Promise<WordActionState> {
  const validated = validateConvertInput(formData.get("word"));

  if (!validated.ok) {
    return { ok: false, error: encoderErrorToMessage(validated.code) };
  }

  try {
    return { ok: true, result: encode(validated.value) };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return { ok: false, error: error.message };
    }

    logServerError("convertWord", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export async function revertWord(
  _prevState: WordActionState,
  formData: FormData,
): Promise<WordActionState> {
  const validated = validateRevertInput(formData.get("word"));

  if (!validated.ok) {
    return { ok: false, error: encoderErrorToMessage(validated.code) };
  }

  try {
    return { ok: true, result: decode(validated.value) };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return { ok: false, error: error.message };
    }

    logServerError("revertWord", error);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
