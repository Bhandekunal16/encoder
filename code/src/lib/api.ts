import { NextResponse } from "next/server";

export type ApiResponse = {
  data: string;
  status: boolean;
  msg: string;
  statusCode: number;
};

export function parseWordFromRequest(request: Request): Promise<string | null> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json().then((body) => {
      if (body && typeof body.word === "string") {
        return body.word;
      }
      return null;
    });
  }

  return request.formData().then((formData) => {
    const word = formData.get("word");
    return typeof word === "string" ? word : null;
  });
}

export function apiSuccess(data: string): NextResponse<ApiResponse> {
  return NextResponse.json({
    data,
    status: true,
    msg: "success",
    statusCode: 200,
  });
}

export function apiError(message: string, statusCode = 400): NextResponse {
  return NextResponse.json(
    { data: "", status: false, msg: message, statusCode },
    { status: statusCode },
  );
}
