const CHARSET =
  ` abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".,:;'|/?!@#$%^&*()-_+={}[]<>0123456789`;

export function convert(input: string): string {
  const result = new Array<string>(input.length);

  for (let i = 0; i < input.length; i++) {
    result[i] = String(CHARSET.indexOf(input[i]));
  }

  return result.join(".");
}

export function revert(input: string): string {
  const values = input.split(".");
  const result = new Array<string>(values.length);

  for (let i = 0; i < values.length; i++) {
    result[i] = CHARSET[Number(values[i])] ?? "";
  }

  return result.join("");
}
