import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { links, profile } from "@/lib/content";
import { themeScript } from "@/lib/theme";

import "./globals.css";

const title = `${profile.name} — Full-Stack Engineer, Frontend Lead, Agent-Native`;
const description =
  "Full-stack engineer and frontend lead. Enterprise platforms, LLM systems and agent architectures in production — built in public, streamed on YouTube.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: profile.name, url: links.site }],
  openGraph: { title, description, type: "profile", url: links.github },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e7e7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The theme class is set by the inline script before paint, hence the warning opt-out.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
