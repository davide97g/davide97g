import { Github } from "lucide-react";

import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { links, nav, profile } from "@/lib/content";

/**
 * Sticky chrome. No holo here — the hero's primary action owns the page's one
 * holo element, and a shimmering header would compete with it on every scroll.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-[var(--glass-blur)]">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center px-4 sm:px-6">
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            dg
          </span>
          <span className="font-display text-sm font-bold tracking-tight transition-colors group-hover:text-primary-ink sm:text-base">
            {profile.name}
          </span>
        </a>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <HudLabel size="sm" className="hidden xl:block">
            @{profile.handle}
          </HudLabel>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <QuackButton asChild variant="outline" size="sm">
              <a href={links.github} target="_blank" rel="noopener">
                <Github className="size-4" />
                GitHub
              </a>
            </QuackButton>
          </div>
        </div>
      </div>
    </header>
  );
}
