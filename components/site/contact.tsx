import { ArrowUpRight, Github, Globe, Mail, Youtube } from "lucide-react";

import { HoloSeparator } from "@/components/ui/holo-separator";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import { links, profile } from "@/lib/content";

const elsewhere = [
  { label: "davideghiotto.it", href: links.site, icon: Globe },
  { label: "github.com/davide97g", href: links.github, icon: Github },
  { label: "youtube.com/@davideghi", href: links.youtube, icon: Youtube },
  { label: profile.email, href: links.email, icon: Mail },
];

export function Contact() {
  return (
    <footer
      id="contact"
      className="mx-auto w-full max-w-[1400px] px-4 pt-20 pb-16 sm:px-6 lg:pt-28"
    >
      <div className="flex flex-col gap-6">
        <HudLabel tone="primary" dot>
          Contact
        </HudLabel>
        <h2 className="font-display max-w-2xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
          Looking to collaborate on open source.
        </h2>
        <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          If you are building something with agents in the loop — or want a
          second pair of eyes on a frontend architecture — the inbox is open.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <QuackButton asChild variant="primary" size="lg">
            <a href={links.email}>
              <Mail className="size-4" />
              Get in touch
            </a>
          </QuackButton>
          <QuackButton asChild variant="outline" size="lg">
            <a href={links.site} target="_blank" rel="noopener">
              Full site
              <ArrowUpRight className="size-4" />
            </a>
          </QuackButton>
        </div>
      </div>

      <HoloSeparator label="Elsewhere" className="my-12" />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {elsewhere.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noopener"}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <item.icon className="size-4 shrink-0 text-primary-ink" />
              <span className="truncate font-mono text-xs sm:text-sm">
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 pt-12 sm:flex-row sm:items-center sm:justify-between">
        <HudLabel size="sm" tracking="tight">
          © {profile.name} · Building in public
        </HudLabel>
        <p className="text-xs text-muted-foreground">
          Built with{" "}
          <a
            href={links.duckui}
            target="_blank"
            rel="noopener"
            className="text-primary-ink underline-offset-4 hover:underline"
          >
            duck/ui
          </a>{" "}
          — my own design system, installed from its shadcn registry.
        </p>
      </div>
    </footer>
  );
}
