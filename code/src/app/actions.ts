"use server";

import { encode, decode } from "@/lib/wordEncoder";
import { validateConvertInput, validateRevertInput } from "@/lib/validation";
import { submitWordFormAction } from "@/lib/wordFormAction";
import type { WordActionState } from "@/types/actions";
import type { ErrorConfig } from "@/types/app";
import appConfig from "../core/json/app.config.json";

const { ERRORS } = appConfig as { ERRORS: ErrorConfig };
const { somethingWentWrong } = ERRORS;

export async function convertWord(
  _prevState: WordActionState,
  formData: FormData,
): Promise<WordActionState> {
  return submitWordFormAction(formData, {
    validate: validateConvertInput,
    transform: encode,
    actionName: "convertWord",
    fallbackError: somethingWentWrong,
  });
}

export async function revertWord(
  _prevState: WordActionState,
  formData: FormData,
): Promise<WordActionState> {
  return submitWordFormAction(formData, {
    validate: validateRevertInput,
    transform: decode,
    actionName: "revertWord",
    fallbackError: somethingWentWrong,
  });
}
