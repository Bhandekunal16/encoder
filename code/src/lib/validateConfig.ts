type AppConfigShape = {
  SITE_META: {
    title: string;
    description: string;
  };
  TITLES: {
    api: string;
  };
};

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid config: ${label} must be a non-empty string.`);
  }
}

export function validateAppConfig(config: AppConfigShape): void {
  assertNonEmptyString(config.SITE_META.title, "SITE_META.title");
  assertNonEmptyString(config.SITE_META.description, "SITE_META.description");
  assertNonEmptyString(config.TITLES.api, "TITLES.api");
}
