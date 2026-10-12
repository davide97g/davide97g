import { principles, stack, trajectory } from "@/lib/content";
import { cn } from "@/lib/utils";

import { Card, Section } from "./section";

export function TrajectorySection() {
  return (
    <Section id="trajectory" index="04" title="Trajectory" detail="Seven years, four teams, one direction">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-5 sm:p-6">
          <h3 className="sr-only">Roles</h3>
          <ol className="relative">
            {trajectory.map((t, i) => (
              <li key={t.company} className="relative grid gap-1 pb-7 pl-7 last:pb-0 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-6 sm:pl-0">
                {/* The rail: a dot per role, the current one filled and breathing. */}
                <span aria-hidden className="absolute top-1.5 bottom-0 left-[5px] w-px bg-border sm:left-[129px]" />
                <span aria-hidden className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-card bg-card sm:left-[124px]">
                  <span className={cn("block size-full rounded-full", i === 0 ? "live-dot bg-foreground" : "bg-subtle")} />
                </span>
                <p className="font-mono text-xs text-muted-foreground sm:pt-0.5">{t.period}</p>
                <div className="sm:pl-6">
                  <p className="font-semibold tracking-tight">
                    {t.role} <span className="font-normal text-muted-foreground">· {t.company}</span>
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-5 sm:p-6" style={{ "--i": 1 }}>
            <h3 className="font-semibold tracking-tight">Stack</h3>
            <dl className="mt-4 grid gap-3">
              {stack.map((g) => (
                <div key={g.name}>
                  <dt className="text-xs text-muted-foreground">{g.name}</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <span key={it} className="rounded-md border bg-chip px-2 py-0.5 font-mono text-[11px]">
                        {it}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-5 sm:p-6" style={{ "--i": 2 }}>
            <h3 className="font-semibold tracking-tight">How I work</h3>
            <ol className="mt-3 grid gap-2.5">
              {principles.map((p, i) => (
                <li key={p} className="flex items-baseline gap-3 text-sm">
                  <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </Section>
  );
}
