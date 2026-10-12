import { ArrowUpRight } from "lucide-react";

import { links, now, profile } from "@/lib/content";
import { longestStreak, shortDate, snapshot } from "@/lib/snapshot";

import { CountUp } from "./effects";
import { Card } from "./section";

const days = snapshot.contributions.weeks.flat();

const STATS = [
  { label: "Contributions", value: snapshot.contributions.total, foot: "last 12 months" },
  { label: "Commits", value: snapshot.contributions.commits, foot: `${snapshot.contributions.pullRequests} pull requests` },
  { label: "Longest streak", value: longestStreak(days), foot: "days in a row" },
  { label: "Public repos", value: snapshot.user.publicRepos, foot: `on GitHub since ${snapshot.user.createdAt.slice(0, 4)}` },
];

function Identity() {
  const [first, second] = profile.headline;
  return (
    <Card className="flex flex-col p-6 sm:p-8">
      <div className="flex items-start gap-3">
        {/* The avatar is the one colourful thing on the page: it waits in grey until asked. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://github.com/${profile.handle}.png?size=96`}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-xl object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-muted-foreground">
            @{profile.handle} · {profile.meta}
          </p>
        </div>
        <span className="flex h-7 shrink-0 items-center gap-2 rounded-full border bg-chip px-3 text-xs font-medium">
          <span aria-hidden className="live-dot size-1.5 rounded-full bg-live" />
          {profile.status}
        </span>
      </div>

      <h1 className="mt-10 text-[clamp(2.4rem,6.2vw,4.4rem)] leading-[0.98] font-semibold tracking-[-0.045em] sm:mt-14">
        <span className="block">{first}</span>
        <span className="block text-subtle">
          {second}
          <span aria-hidden className="caret ml-2 inline-block h-[0.78em] w-[0.36em] translate-y-[0.06em] rounded-[3px] bg-foreground" />
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{profile.lead}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label="In short">
        {profile.chips.map((c) => (
          <li key={c} className="rounded-lg border bg-chip px-2.5 py-1 font-mono text-[11.5px]">
            {c}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-8">
        <a
          href="#work"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform duration-150 hover:-translate-y-px active:scale-[.98]"
        >
          See the work
        </a>
        <a
          href={links.site}
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border bg-card px-4 text-sm font-medium transition-colors hover:bg-accent"
        >
          davideghiotto.it <ArrowUpRight className="nudge size-3.5 text-muted-foreground" aria-hidden />
        </a>
      </div>
    </Card>
  );
}

/** The black card: a chrome orb over a studio light, and what is happening now, one at a time. */
function Now() {
  return (
    <div
      data-reveal
      style={{ "--i": 1 } as React.CSSProperties}
      className="now-card relative isolate flex min-h-[380px] flex-col overflow-hidden rounded-3xl border border-ink-line bg-ink p-6 text-ink-foreground"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ArrowUpRight className="size-4" aria-hidden />
        Now
        <span className="ml-auto font-mono text-[11.5px] font-normal text-ink-muted">{shortDate(snapshot.generatedAt, false)}</span>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 flex h-52 flex-col items-center justify-center">
        <span className="studio-light absolute size-72" />
        <span className="chrome-orb relative size-28" />
        <span className="orb-floor mt-5 h-3 w-24" />
      </div>

      <div className="mt-auto grid">
        {now.map((item, n) => (
          <a
            key={item.title}
            href={item.href}
            className="now-item group block"
            style={{ "--n": n } as React.CSSProperties}
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-ink-muted uppercase">{item.label}</span>
            <span className="mt-1 flex items-center gap-2 text-[2rem] leading-tight font-semibold tracking-tight">
              {item.title}
              <ArrowUpRight className="nudge size-5 text-ink-muted" aria-hidden />
            </span>
            <span className="block text-sm text-ink-muted">{item.detail}</span>
          </a>
        ))}
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {now.map((item) => (
          <span key={item.title} className="now-bar h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-ink-foreground" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Overview() {
  return (
    <section id="overview" aria-label="Overview" className="scroll-mt-32 lg:scroll-mt-24">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Identity />
        <Now />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Card key={s.label} className="p-5" style={{ "--i": i + 2 }}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-3 text-[2.25rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">
              <CountUp value={s.value} />
            </dd>
            <dd className="mt-2 font-mono text-[11px] text-muted-foreground">{s.foot}</dd>
          </Card>
        ))}
      </dl>
    </section>
  );
}
