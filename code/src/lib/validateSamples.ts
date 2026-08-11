import type { ApiSample } from "@/types/apiGuide";

export function validateSamples(samples: ApiSample[]): void {
  const seen = new Set<string>();

  for (const sample of samples) {
    if (!sample.id.trim()) {
      throw new Error("API sample is missing a non-empty id.");
    }

    if (seen.has(sample.id)) {
      throw new Error(`Duplicate API sample id: "${sample.id}".`);
    }

    seen.add(sample.id);

    if (!sample.method.trim()) {
      throw new Error(`API sample "${sample.id}" is missing a method.`);
    }
  }
}
