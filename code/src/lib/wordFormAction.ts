import { WordEncoderError } from "@/lib/wordEncoder";
import { encoderErrorToMessage, type ValidationResult } from "@/lib/validation";
import { logServerError } from "@/lib/logger";
import type { WordActionState } from "@/types/actions";

type SubmitWordFormActionOptions = {
  validate: (input: unknown) => ValidationResult<string>;
  transform: (value: string) => string;
  actionName: string;
  fallbackError: string;
};

export async function submitWordFormAction(
  formData: FormData,
  options: SubmitWordFormActionOptions,
): Promise<WordActionState> {
  const validated = options.validate(formData.get("word"));

  if (!validated.ok) {
    return { ok: false, error: encoderErrorToMessage(validated.code) };
  }

  try {
    return { ok: true, result: options.transform(validated.value) };
  } catch (error) {
    if (error instanceof WordEncoderError) {
      return { ok: false, error: error.message };
    }

    logServerError(options.actionName, error);
    return { ok: false, error: options.fallbackError };
  }
}
