"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** duck/ui's ThemeSwitcher drives this. Dark is the default, not the fallback. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
