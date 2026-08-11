import type { ReactElement } from "react";
import type { ToolIcon } from "@/types/tools";

type IconProps = {
  className?: string;
  label?: string;
};

export type ToolIconGlyphProps = {
  icon: ToolIcon;
  className?: string;
  label?: string;
};

type IconComponent = (props: IconProps) => ReactElement;

const STROKE = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function EncodeIcon({ className, label }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" {...STROKE} />
      <path d="M7 12h4M13 9v6M16 12h4" {...STROKE} />
    </svg>
  );
}

function DecodeIcon({ className, label }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" {...STROKE} />
      <path d="M7 9v6M10 12H4M16 9v6M20 12h-6" {...STROKE} />
    </svg>
  );
}

function ApiIcon({ className, label }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <path d="M8 6L3 12l5 6M16 6l5 6-5 6M14 4l-4 16" {...STROKE} />
    </svg>
  );
}

function NpmIcon({ className, label }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
    >
      <rect x="3" y="6" width="18" height="12" rx="1.5" {...STROKE} />
      <path d="M3 10h6v8H3V10z" fill="currentColor" />
    </svg>
  );
}

const ICONS = {
  encode: EncodeIcon,
  decode: DecodeIcon,
  api: ApiIcon,
  npm: NpmIcon,
} satisfies Record<ToolIcon, IconComponent>;

export function ToolIconGlyph({ icon, className, label }: ToolIconGlyphProps) {
  const Icon = ICONS[icon];
  return <Icon className={className} label={label} />;
}
