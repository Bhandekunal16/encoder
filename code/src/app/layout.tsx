import type { Metadata } from "next";
import { SITE_META } from "@/constants/meta";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  keywords: SITE_META.keywords,
  authors: [{ name: SITE_META.author }],
  openGraph: {
    title: SITE_META.ogTitle,
    description: SITE_META.ogDescription,
    url: SITE_META.ogUrl,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
