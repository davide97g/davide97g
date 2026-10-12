import { ArrowUpRight } from "lucide-react";

import { projects, type ProjectStatus } from "@/lib/content";
import { cn } from "@/lib/utils";

import { Card, Section } from "./section";

const DOT: Record<ProjectStatus, string> = {
  Live: "live-dot bg-live",
  "Open source": "bg-foreground",
  Private: "bg-subtle",
};

export function WorkSection() {
  return (
    <Section id="work" index="02" title="Work" detail="Things I ship and keep running">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, i) => (
          <Card as="li" key={p.title} className="group transition-transform duration-300 hover:-translate-y-0.5" style={{ "--i": i % 3 }}>
            <a href={p.href} className="flex h-full flex-col rounded-3xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-[17px] font-semibold text-primary-foreground transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-rotate-6">
                  {p.title[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span aria-hidden className={cn("size-1.5 rounded-full", DOT[p.status])} />
                    {p.status} · {p.year}
                  </p>
                </div>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border bg-chip transition-colors duration-200 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="nudge size-4" aria-hidden />
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-md border bg-chip px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-4 truncate border-t pt-3 font-mono text-[11px] text-muted-foreground">
                <span className="sr-only">Open </span>
                {p.linkLabel}
              </p>
            </a>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
