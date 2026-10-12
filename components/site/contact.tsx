import { ArrowUpRight, Github, Globe, Instagram, Linkedin, Mail, Youtube } from "lucide-react";

import { links, profile } from "@/lib/content";
import { shortDate, snapshot } from "@/lib/snapshot";

import { CopyEmail } from "./copy-email";
import { Mark } from "./mark";
import { Section } from "./section";

const CHANNELS = [
  { label: "Portfolio", value: "davideghiotto.it", href: links.site, icon: Globe },
  { label: "GitHub", value: "davide97g", href: links.github, icon: Github },
  { label: "YouTube", value: "@davideghi", href: links.youtube, icon: Youtube },
  { label: "LinkedIn", value: "davide-ghiotto", href: links.linkedin, icon: Linkedin },
  { label: "Instagram", value: "@ai_quack", href: links.instagram, icon: Instagram },
];

export function ContactSection() {
  return (
    <Section id="contact" index="05" title="Contact" detail="Open-source, collaborations, a talk">
      <div
        data-reveal
        className="relative isolate grid gap-8 overflow-hidden rounded-3xl border border-ink-line bg-ink p-6 text-ink-foreground sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
      >
        <span aria-hidden className="silk absolute -top-24 -right-24 -z-10 size-[28rem]" />
        <div>
          <p className="text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Let&apos;s build something
            <span className="block text-ink-muted">together.</span>
          </p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-muted">
            Looking to collaborate on open-source projects and agent tooling. Write and I&apos;ll answer, usually within a day.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <CopyEmail email={profile.email} />
            <a
              href={links.email}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-medium transition-colors hover:bg-white/10"
            >
              <Mail className="size-4" aria-hidden /> Write an email
            </a>
          </div>
        </div>
        <ul className="grid content-end gap-1">
          {CHANNELS.map(({ label, value, href, icon: Icon }) => (
            <li key={label}>
              <a href={href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8">
                <span className="grid size-9 place-items-center rounded-lg bg-white/10">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block font-mono text-[11px] text-ink-muted">{value}</span>
                </span>
                <ArrowUpRight className="nudge size-4 text-ink-muted" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2.5">
          <Mark className="size-6" />
          <span className="font-medium text-foreground">{profile.name}</span>
        </span>
        <span>Built in public, one commit at a time.</span>
        <span className="font-mono text-[11px] sm:ml-auto">
          snapshot {shortDate(snapshot.generatedAt)} · press <kbd className="rounded border bg-card px-1">⌘K</kbd>
        </span>
      </footer>
    </Section>
  );
}
