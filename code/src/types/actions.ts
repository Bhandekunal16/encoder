export type WordActionState =
  | { ok: true; result: string }
  | { ok: false; error: string }
  | null;
