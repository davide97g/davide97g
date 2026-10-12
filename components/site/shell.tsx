"use client";

import {
  Activity,
  ArrowUpRight,
  AtSign,
  Briefcase,
  Calendar,
  Clapperboard,
  Command,
  LayoutGrid,
  Moon,
  Route,
  Search,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { links, profile, sections, type SectionId } from "@/lib/content";
import { shortDate, snapshot } from "@/lib/snapshot";
import { currentTheme, toggleTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

import { Effects } from "./effects";
import { Mark } from "./mark";
import { Palette, type PaletteItem } from "./palette";

const ICONS: Record<SectionId, LucideIcon> = {
  overview: LayoutGrid,
  activity: Activity,
  work: Briefcase,
  channel: Clapperboard,
  trajectory: Route,
  contact: AtSign,
};

/** Sidebar groups, autocratico-style: what is going on, then the archive. */
const GROUPS: { label: string; ids: SectionId[] }[] = [
  { label: "Now", ids: ["overview", "activity", "work", "channel"] },
  { label: "Archive", ids: ["trajectory", "contact"] },
];

const label = (id: SectionId) => sections.find((s) => s.id === id)!.label;

function jump(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function useActiveSection() {
  const [active, setActive] = useState<SectionId>("overview");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setTheme(currentTheme());
    const on = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return theme;
}

function ThemeButton({ className }: { className?: string }) {
  const theme = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
      aria-label={theme === "dark" ? "Switch to light theme (T)" : "Switch to dark theme (T)"}
      title="Toggle theme (T)"
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-xl border bg-card text-foreground transition-transform duration-150 hover:-translate-y-px active:scale-95",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

function SearchButton({ onOpen, compact }: { onOpen: () => void; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Search and jump (Command K)"
      className={cn(
        "group flex h-10 items-center gap-2.5 rounded-xl border bg-card pr-2 pl-1 text-sm text-muted-foreground transition-colors hover:text-foreground",
        compact ? "w-10 justify-center px-0" : "w-full max-w-72",
      )}
    >
      <span className={cn("grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground", compact && "size-full rounded-[11px]")}>
        <Search className="size-4" aria-hidden />
      </span>
      {!compact && (
        <>
          <span className="flex-1 text-left">Jump to…</span>
          <kbd className="flex items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px]">
            <Command className="size-3" aria-hidden />K
          </kbd>
        </>
      )}
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const active = useActiveSection();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const chips = useRef<HTMLElement>(null);

  // Mobile: keep the active section's chip in view as the page scrolls.
  useEffect(() => {
    const nav = chips.current;
    const chip = nav?.querySelector<HTMLElement>(`[href="#${active}"]`);
    if (!nav || !chip || nav.offsetParent === null) return;
    nav.scrollTo({ left: chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      const t = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || t.closest("input, textarea, [contenteditable], dialog")) return;
      if (e.key === "t" || e.key === "T") toggleTheme();
      const n = Number(e.key);
      if (n >= 1 && n <= sections.length) jump(sections[n - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items: PaletteItem[] = [
    ...sections.map((s, i) => ({
      id: s.id,
      group: "Sections",
      label: s.label,
      icon: ICONS[s.id],
      hint: String(i + 1),
      run: () => jump(s.id),
    })),
    { id: "theme", group: "Actions", label: "Toggle theme", icon: Moon, hint: "T", run: () => toggleTheme() },
    {
      id: "copy",
      group: "Actions",
      label: `Copy ${profile.email}`,
      icon: AtSign,
      run: () => navigator.clipboard?.writeText(profile.email),
    },
    ...(
      [
        ["Portfolio", links.site],
        ["GitHub", links.github],
        ["YouTube", links.youtube],
        ["LinkedIn", links.linkedin],
        ["Instagram", links.instagram],
      ] as const
    ).map(([name, href]) => ({
      id: name,
      group: "Links",
      label: name,
      icon: ArrowUpRight,
      hint: new URL(href).hostname.replace("www.", ""),
      run: () => window.open(href, "_blank", "noopener"),
    })),
  ];

  return (
    <div className="mx-auto grid max-w-[1360px] grid-cols-1 gap-4 px-4 pb-10 sm:px-5 lg:grid-cols-[236px_minmax(0,1fr)] lg:pt-4">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="sticky top-4 hidden h-[calc(100dvh-2rem)] flex-col rounded-3xl border bg-card p-3 lg:flex">
        <a href="#overview" className="flex items-center gap-3 rounded-xl p-2" aria-label={`${profile.name}, back to top`}>
          <Mark className="size-9" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{profile.name}</span>
            <span className="block truncate text-xs text-muted-foreground">@{profile.handle}</span>
          </span>
        </a>

        <nav aria-label="Sections" className="mt-4 flex flex-col gap-5">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <p className="px-3 pb-1.5 text-xs text-muted-foreground">{g.label}</p>
              <ul className="flex flex-col gap-0.5">
                {g.ids.map((id) => {
                  const Icon = ICONS[id];
                  const on = active === id;
                  const n = sections.findIndex((s) => s.id === id) + 1;
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        aria-current={on ? "location" : undefined}
                        className={cn(
                          "group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200",
                          on ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
                        )}
                      >
                        <Icon className="size-4 shrink-0" aria-hidden />
                        <span className="flex-1">{label(id)}</span>
                        <kbd
                          className={cn(
                            "font-mono text-[11px] opacity-0 transition-opacity group-hover:opacity-60",
                            on && "opacity-60",
                          )}
                        >
                          {n}
                        </kbd>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* The one call to action, on black with an orb peeking in. */}
        <a
          href={links.youtubeSubscribe}
          target="_blank"
          rel="noreferrer"
          className="group relative mt-auto overflow-hidden rounded-2xl bg-ink p-4 text-ink-foreground"
        >
          <span aria-hidden className="chrome-orb absolute -top-5 -right-5 size-16 opacity-80" />
          <Clapperboard className="size-4" aria-hidden />
          <p className="mt-2 text-sm font-semibold">Watch the build</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">Live coding, agent workflows and honest model comparisons.</p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-lg bg-ink-foreground px-2.5 py-1 text-xs font-medium text-ink">
            Subscribe <ArrowUpRight className="nudge size-3" aria-hidden />
          </span>
        </a>

        <div className="mt-3 flex items-center gap-2 border-t pt-3">
          <span className="flex min-w-0 flex-1 items-center gap-2 px-1 text-xs text-muted-foreground">
            <span aria-hidden className="live-dot size-1.5 shrink-0 rounded-full bg-live" />
            <span className="truncate">{profile.status}</span>
          </span>
          <ThemeButton className="size-9" />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar: the page title on desktop, the whole navigation on mobile. */}
        <header className="topbar sticky top-0 z-30 -mx-4 mb-4 rounded-b-2xl px-4 py-3 sm:-mx-5 sm:px-5 lg:-mx-3 lg:mt-0 lg:rounded-2xl lg:px-3 lg:py-2.5">
          <div className="flex items-center gap-3">
            <a href="#overview" className="lg:hidden" aria-label="Back to top">
              <Mark className="size-9" />
            </a>
            <p className="text-2xl font-semibold tracking-tight lg:text-[2.6rem] lg:leading-none">
              <span className="lg:hidden">{profile.name.split(" ")[0]}</span>
              <span className="hidden lg:inline">{label(active)}</span>
            </p>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden h-10 items-center gap-2.5 rounded-xl border bg-card pr-3 pl-1 md:flex" title="When the data on this page was taken">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="size-4" aria-hidden />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-medium">{shortDate(snapshot.generatedAt)}</span>
                  <span className="block text-[11px] text-muted-foreground">Snapshot</span>
                </span>
              </span>
              <div className="hidden w-64 sm:block">
                <SearchButton onOpen={openPalette} />
              </div>
              <div className="sm:hidden">
                <SearchButton onOpen={openPalette} compact />
              </div>
              <ThemeButton className="lg:hidden" />
            </div>
          </div>
          <nav ref={chips} aria-label="Sections" className="no-scrollbar relative -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 lg:hidden">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={cn(
                  "h-8 shrink-0 rounded-lg border px-3 text-[13px] leading-[30px] font-medium transition-colors",
                  active === s.id ? "border-transparent bg-primary text-primary-foreground" : "bg-card",
                )}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </header>

        <main id="main" className="flex flex-col gap-12">
          {children}
        </main>
      </div>

      <Palette open={paletteOpen} onClose={() => setPaletteOpen(false)} items={items} />
      <Effects />
    </div>
  );
}
