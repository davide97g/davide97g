import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@/components/site/theme-provider";
import { links, profile } from "@/lib/content";

import "./globals.css";

// Display face, matching davideghiotto.it. Body and code stay on Geist, which
// ships with the package instead of being fetched at build time.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const title = `${profile.name} — Full-Stack Engineer, Frontend Lead, AI-Native`;
const description =
  "Full-stack engineer and frontend lead. Enterprise platforms, LLM systems and agent architectures in production — built in public, streamed on YouTube.";

export const metadata: Metadata = {
  title,
  description,
  authors: [{ name: profile.name, url: links.site }],
  openGraph: {
    title,
    description,
    type: "profile",
    url: links.github,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // dark-first: duck/ui treats the dark palette as the reference, and
    // suppressHydrationWarning is what next-themes needs to swap the class.
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${bricolage.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
