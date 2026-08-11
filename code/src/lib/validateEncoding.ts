import { convert, revert } from "@/lib/wordEncoder";
import {
  validateConvertInput,
  validateRevertInput,
} from "@/lib/validation";
import type { ApiSample } from "@/types/apiGuide";

type FailureCase = {
  id: string;
  input: unknown;
  validate: (input: unknown) => { ok: boolean };
};

type SuccessCase = {
  id: string;
  input: string;
  expectedEncoded?: string;
};

const SUCCESS_CASES: SuccessCase[] = [
  { id: "hello", input: "hello", expectedEncoded: "8.5.12.12.15" },
  {
    id: "hello-world",
    input: "hello world",
    expectedEncoded: "8.5.12.12.15.0.23.15.18.12.4",
  },
  { id: "leading-space", input: " hello" },
  { id: "trailing-space", input: "hello " },
  { id: "multiple-spaces", input: "a  b" },
];

const FAILURE_CASES: FailureCase[] = [
  { id: "empty-input", input: "", validate: validateConvertInput },
  {
    id: "unsupported-character-tab",
    input: "hello\tworld",
    validate: validateConvertInput,
  },
  { id: "unicode-character", input: "héllo", validate: validateConvertInput },
  { id: "malformed-encoded", input: "8..5", validate: validateRevertInput },
  { id: "negative-index", input: "-1.5", validate: validateRevertInput },
  { id: "trailing-dot-encoded", input: "8.", validate: validateRevertInput },
  { id: "out-of-range-index", input: "999", validate: validateRevertInput },
  { id: "missing-word-type", input: undefined, validate: validateConvertInput },
  { id: "wrong-input-type-number", input: 42, validate: validateConvertInput },
];

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

    const word = sample.payload.word;
    const validated = sample.id.includes("revert")
      ? validateRevertInput(word)
      : validateConvertInput(word);

    if (!validated.ok) {
      throw new Error(
        `API sample "${sample.id}" payload fails validation: ${validated.message}`,
      );
    }

    const actual = sample.id.includes("revert")
      ? revert(validated.value)
      : convert(validated.value);

    if (actual !== sample.response.data) {
      throw new Error(
        `API sample "${sample.id}" response mismatch. Expected "${sample.response.data}", got "${actual}".`,
      );
    }
  }
}

export function validateEncodingSelfTests(): void {
  for (const testCase of SUCCESS_CASES) {
    const validated = validateConvertInput(testCase.input);

    if (!validated.ok) {
      throw new Error(
        `Encoding self-test "${testCase.id}" failed validation: ${validated.message}`,
      );
    }

    const encoded = convert(validated.value);

    if (testCase.expectedEncoded && encoded !== testCase.expectedEncoded) {
      throw new Error(
        `Encoding self-test "${testCase.id}" expected "${testCase.expectedEncoded}", got "${encoded}".`,
      );
    }

    const roundTrip = revert(encoded);

    if (roundTrip !== testCase.input) {
      throw new Error(
        `Encoding self-test "${testCase.id}" round-trip failed. Expected "${testCase.input}", got "${roundTrip}".`,
      );
    }
  }

  for (const testCase of FAILURE_CASES) {
    const result = testCase.validate(testCase.input);

    if (result.ok) {
      throw new Error(
        `Encoding self-test "${testCase.id}" should have failed validation.`,
      );
    }
  }
}
