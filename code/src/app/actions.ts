"use server";

import { redirect } from "next/navigation";
import { convert, revert } from "@/lib/wordEncoder";
import routeConfig from "@/core/json/route.config.json";
import type { RouteConfig } from "@/types/apiGuide";
import {
  isSafeResultRedirect,
  validateConvertInput,
  validateRevertInput,
} from "@/lib/validation";
import { logServerError } from "@/lib/logger";

const { base } = routeConfig as RouteConfig;

export async function convertWord(formData: FormData) {
  try {
    const validated = validateConvertInput(formData.get("word"));

    if (!validated.ok) {
      redirect(base);
    }

    const ans = convert(validated.value);

    if (!isSafeResultRedirect("/convert", ans)) {
      redirect(base);
    }

    redirect(`/convert?ans=${encodeURIComponent(ans)}`);
  } catch (error) {
    logServerError("convertWord", error);
    redirect(base);
  }
}

export async function revertWord(formData: FormData) {
  try {
    const validated = validateRevertInput(formData.get("word"));

    if (!validated.ok) {
      redirect(base);
    }

    const ans = revert(validated.value);

    if (!isSafeResultRedirect("/revert", ans)) {
      redirect(base);
    }

    redirect(`/revert?ans=${encodeURIComponent(ans)}`);
  } catch (error) {
    logServerError("revertWord", error);
    redirect(base);
  }
}
