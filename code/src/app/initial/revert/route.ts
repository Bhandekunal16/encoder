import { revert } from "@/lib/wordEncoder";
import { apiError, apiSuccess, parseWordFromRequest } from "@/lib/api";

export async function POST(request: Request) {
  const word = await parseWordFromRequest(request);

  if (!word) {
    return apiError("word is required");
  }

  return apiSuccess(revert(word));
}
