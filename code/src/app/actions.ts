"use server";

import { redirect } from "next/navigation";
import { convert, revert } from "@/lib/wordEncoder";

export async function convertWord(formData: FormData) {
  const word = formData.get("word");

  if (typeof word !== "string") {
    redirect("/");
  }

  const ans = convert(word);
  redirect(`/convert?ans=${encodeURIComponent(ans)}`);
}

export async function revertWord(formData: FormData) {
  const word = formData.get("word");

  if (typeof word !== "string") {
    redirect("/");
  }

  const ans = revert(word);
  redirect(`/revert?ans=${encodeURIComponent(ans)}`);
}
