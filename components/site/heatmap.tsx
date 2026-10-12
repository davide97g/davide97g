"use client";

import { useEffect, useRef, useState } from "react";

import { levelScale, snapshot, today, type Day } from "@/lib/snapshot";
import { cn } from "@/lib/utils";

const HEAT = ["bg-heat-0", "bg-heat-1", "bg-heat-2", "bg-heat-3", "bg-heat-4"];

const weeks = snapshot.contributions.weeks;
const level = levelScale(weeks.flat());

const monthLabel = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
const dayLabel = (d: Day) =>
  `${d.count === 0 ? "No" : d.count} contribution${d.count === 1 ? "" : "s"} on ${new Date(`${d.date}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })}`;

/** Months start at the first week whose first day falls in a new month. */
const months = weeks.flatMap((w, col) => {
  const first = w[0]?.date;
  const prev = weeks[col - 1]?.[0]?.date;
  return first && prev && first.slice(5, 7) !== prev.slice(5, 7) && col < weeks.length - 2 ? [{ col, label: monthLabel(first) }] : [];
});

/** The contribution calendar: 53 weeks, one tooltip that follows the pointer. */
export function Heatmap() {
  const box = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // On a narrow screen the grid scrolls; start at the most recent weeks.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  const show = (el: HTMLElement) => {
    const b = box.current!.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setTip({ x: r.left - b.left + r.width / 2, y: r.top - b.top, text: el.dataset.tip! });
  };

  return (
    <div ref={box} className="relative">
      <div ref={scroller} className="no-scrollbar -mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
        <div
          className="heat grid min-w-[680px] gap-[3px] pt-5"
          style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`, gridTemplateRows: "auto repeat(7, auto)" }}
          role="img"
          aria-label={`${snapshot.contributions.total} contributions in the last year`}
          onPointerOver={(e) => {
            const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
            if (el) show(el);
          }}
          onPointerLeave={() => setTip(null)}
        >
          {months.map((m) => (
            <span
              key={m.col}
              aria-hidden
              className="font-mono text-[10.5px] whitespace-nowrap text-muted-foreground"
              style={{ gridColumn: `${m.col + 1} / span 4`, gridRow: 1 }}
            >
              {m.label}
            </span>
          ))}
          {weeks.map((week, col) =>
            week.map((d) => {
              const row = new Date(`${d.date}T00:00:00Z`).getUTCDay();
              const isToday = d.date === today;
              return (
                <span
                  key={d.date}
                  aria-hidden
                  data-tip={dayLabel(d)}
                  className={cn(
                    "cell block aspect-square rounded-[3px] transition-transform duration-150 hover:scale-125",
                    HEAT[level(d.count)],
                    isToday && "today-ring outline-[1.5px] outline-offset-[1.5px] outline-foreground outline-solid",
                  )}
                  style={{ gridColumn: col + 1, gridRow: row + 2, "--d": `${120 + col * 14 + row * 12}ms` } as React.CSSProperties}
                />
              );
            }),
          )}
        </div>
      </div>
      {tip && (
        <span
          role="status"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground shadow-lg"
          style={{ left: tip.x, top: tip.y }}
        >
          {tip.text}
        </span>
      )}
    </div>
  );
}

export function HeatLegend() {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground" aria-hidden>
      Less
      {HEAT.map((c) => (
        <span key={c} className={cn("size-2.5 rounded-[3px]", c)} />
      ))}
      More
    </span>
  );
}
