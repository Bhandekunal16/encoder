import { NextResponse } from "next/server";
import { validateApiWord } from "@/lib/validation";

export type ApiResponse = {
  data: string;
  status: boolean;
  msg: string;
  statusCode: number;
};

export type ParseWordResult =
  | { ok: true; word: string }
  | { ok: false; msg: string; statusCode: number };

export async function parseWordFromRequest(
  request: Request,
): Promise<ParseWordResult> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return {
        ok: false,
        msg: "Malformed JSON",
        statusCode: 400,
      };
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return {
        ok: false,
        msg: "Invalid JSON body",
        statusCode: 400,
      };
    }

    const word = (body as Record<string, unknown>).word;
    const validated = validateApiWord(word);

    if (!validated.ok) {
      return {
        ok: false,
        msg: validated.message,
        statusCode: 400,
      };
    }

    return { ok: true, word: validated.value };
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    const word = formData.get("word");
    const validated = validateApiWord(word);

    if (!validated.ok) {
      return {
        ok: false,
        msg: validated.message,
        statusCode: 400,
      };
    }

    return { ok: true, word: validated.value };
  }

  if (!contentType) {
    return {
      ok: false,
      msg: "Content-Type header is required",
      statusCode: 415,
    };
  }

  return {
    ok: false,
    msg: "Unsupported Content-Type",
    statusCode: 415,
  };
}

export function apiSuccess(data: string): NextResponse<ApiResponse> {
  return NextResponse.json({
    data,
    status: true,
    msg: "success",
    statusCode: 200,
  });
}

export function apiError(
  message: string,
  statusCode = 400,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    { data: "", status: false, msg: message, statusCode },
    { status: statusCode },
  );
}
