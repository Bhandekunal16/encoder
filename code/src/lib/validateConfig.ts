import type { ConvertConfig } from "@/types/convert";
import type { RouteConfig } from "@/types/apiGuide";
import type { ButtonsConfig, LinksConfig } from "@/types/app";

type AppConfigShape = {
  SITE_META: {
    title: string;
    description: string;
  };
  TITLES: {
    home: string;
    convert: string;
    revert: string;
    api: string;
  };
  BUTTONS: ButtonsConfig;
  LINKS: LinksConfig;
};

function assertNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid config: ${label} must be a non-empty string.`);
  }
}

export function validateAppConfig(config: AppConfigShape): void {
  assertNonEmptyString(config.SITE_META.title, "SITE_META.title");
  assertNonEmptyString(config.SITE_META.description, "SITE_META.description");
  assertNonEmptyString(config.TITLES.home, "TITLES.home");
  assertNonEmptyString(config.TITLES.convert, "TITLES.convert");
  assertNonEmptyString(config.TITLES.revert, "TITLES.revert");
  assertNonEmptyString(config.TITLES.api, "TITLES.api");
  assertNonEmptyString(config.BUTTONS.convert, "BUTTONS.convert");
  assertNonEmptyString(config.BUTTONS.revert, "BUTTONS.revert");
  assertNonEmptyString(config.LINKS.back, "LINKS.back");
}

export function validateConvertConfig(config: ConvertConfig): void {
  assertNonEmptyString(config.title, "convert.config title");

  if (!Array.isArray(config.inputs) || config.inputs.length === 0) {
    throw new Error("Invalid config: convert.config inputs must be a non-empty array.");
  }

  const names = new Set<string>();

  for (const input of config.inputs) {
    assertNonEmptyString(input.name, "convert input name");
    assertNonEmptyString(input.placeholder, "convert input placeholder");

    if (names.has(input.name)) {
      throw new Error(`Invalid config: duplicate convert input name "${input.name}".`);
    }

    names.add(input.name);
  }
}

export function validateRouteConfig(config: RouteConfig): void {
  assertNonEmptyString(config.base, "route.config base");

  if (!config.base.startsWith("/")) {
    throw new Error('Invalid config: route.config base must start with "/".');
  }
}
