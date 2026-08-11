import { decode } from "@/lib/wordEncoder";
import { apiError, apiSuccess, parseWordFromRequest } from "@/lib/api";
import { logServerError } from "@/lib/logger";
import { encoderErrorToMessage, validateRevertInput } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = await parseWordFromRequest(request);

    if (!parsed.ok) return apiError(parsed.msg, parsed.statusCode);

    const validated = validateRevertInput(parsed.word);

    if (!validated.ok)
      return apiError(encoderErrorToMessage(validated.code), 400);

    return apiSuccess(decode(validated.value));
  } catch (error) {
    logServerError("POST /initial/revert", error);
    return apiError("Internal server error", 500);
  }
}
