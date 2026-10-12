import { ArrowUpRight, GitBranch } from "lucide-react";

import { links } from "@/lib/content";
import { ago, snapshot } from "@/lib/snapshot";
import { cn } from "@/lib/utils";

import { CountUp } from "./effects";
import { HeatLegend, Heatmap } from "./heatmap";
import { Card, Section } from "./section";

const c = snapshot.contributions;

/** Recency, as a bar that fades from ink to hairline. */
const SHADES = ["bg-foreground", "bg-foreground/70", "bg-muted-foreground", "bg-subtle", "bg-subtle/70", "bg-border"];

export function ActivitySection() {
  return (
    <Section id="activity" index="01" title="Activity" detail="Straight from the GitHub API, refreshed every day">
      <div className="grid grid-cols-1 gap-4">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Contributions</h3>
              <p className="text-sm text-muted-foreground">Last 12 months, day by day</p>
            </div>
            <p className="ml-auto text-right">
              <CountUp value={c.total} className="block text-[2rem] leading-none font-semibold tracking-[-0.04em] tabular-nums" />
              <span className="text-xs text-muted-foreground">contributions</span>
            </p>
          </div>
          <Heatmap />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <HeatLegend />
            <p className="font-mono text-[11px] text-muted-foreground">
              {c.commits.toLocaleString("en-US")} commits · {c.pullRequests} pull requests · {c.issues} issues
            </p>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Recently pushed</h3>
              <p className="text-sm text-muted-foreground">Public repos, newest first</p>
            </div>
            <a
              href={`${links.github}?tab=repositories`}
              aria-label="All repositories on GitHub"
              className="ml-auto grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-px"
            >
              <GitBranch className="size-4" aria-hidden />
            </a>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
            {snapshot.recent.map((repo, i) => (
              <li key={repo.name} className="border-t first:border-t-0 md:[&:nth-child(2)]:border-t-0">
                <a href={repo.url} className="group flex items-center gap-3 py-3">
                  <span aria-hidden className={cn("h-9 w-[3px] shrink-0 rounded-full", SHADES[i])} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                      {repo.name}
                      <ArrowUpRight className="nudge size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[repo.language, repo.stars ? `★ ${repo.stars}` : null, repo.description].filter(Boolean).join(" · ") || "—"}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full border bg-chip px-2.5 py-0.5 font-mono text-[11px]">{ago(repo.pushedAt)}</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
