export function logServerError(context: string, error: unknown): void {
  if (error instanceof Error) {
    console.error(`[${context}] ${error.name}: ${error.message}`);
    return;
  }

  console.error(`[${context}]`, error);
}
