import type { ToolIcon } from "@/types/tools";

type IconProps = {
  className?: string;
};

function EncodeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12h4M13 9v6M16 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DecodeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 9v6M10 12H4M16 9v6M20 12h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ApiIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 6L3 12l5 6M16 6l5 6-5 6M14 4l-4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NpmIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h6v8H3V10z" fill="currentColor" />
    </svg>
  );
}

const ICONS: Record<ToolIcon, (props: IconProps) => React.ReactElement> = {
  encode: EncodeIcon,
  decode: DecodeIcon,
  api: ApiIcon,
  npm: NpmIcon,
};

export function ToolIconGlyph({
  icon,
  className,
}: {
  icon: ToolIcon;
  className?: string;
}) {
  const Component = ICONS[icon];
  return <Component className={className} />;
}
