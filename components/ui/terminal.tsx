"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TerminalLine {
  /** Prompt shown before the command. Defaults to the terminal prompt prop. */
  prompt?: string;
  /** The command that gets typed out. */
  text: string;
  /** Result printed under the command once typing finishes. */
  output?: string;
}

/**
 * Terminal — a command line that types itself. Starts when it scrolls into
 * view, so the demo is never already over by the time it is seen.
 *
 * Under prefers-reduced-motion the full transcript renders immediately.
 */
function Terminal({
  className,
  lines,
  title = "bash",
  prompt = "$",
  speed = 34,
  loop = false,
  holo = false,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  lines: TerminalLine[];
  title?: string;
  prompt?: string;
  /** Milliseconds per character. */
  speed?: number;
  loop?: boolean;
  holo?: boolean;
}) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [started, setStarted] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const [cursor, setCursor] = React.useState({
    line: 0,
    char: 0,
    output: false,
  });

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true);
      return;
    }
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const done = cursor.line >= lines.length;

  React.useEffect(() => {
    if (instant || !started) return;

    if (done) {
      if (!loop) return;
      const reset = window.setTimeout(
        () => setCursor({ line: 0, char: 0, output: false }),
        2600
      );
      return () => window.clearTimeout(reset);
    }

    const line = lines[cursor.line];
    let delay = speed;
    let next = () => setCursor((c) => ({ ...c, char: c.char + 1 }));

    if (cursor.char >= line.text.length) {
      if (line.output && !cursor.output) {
        delay = 320;
        next = () => setCursor((c) => ({ ...c, output: true }));
      } else {
        delay = 460;
        next = () => setCursor({ line: cursor.line + 1, char: 0, output: false });
      }
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [cursor, done, instant, lines, loop, speed, started]);

  const visibleLines = instant || done ? lines.length : cursor.line + 1;

  return (
    <div
      ref={hostRef}
      data-slot="terminal"
      className={cn(
        "overflow-hidden rounded-xl bg-card",
        holo ? "holo-border" : "sticker border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 border-b-2 border-border px-4 py-2.5">
        <span className="size-3 rounded-full bg-[oklch(0.65_0.2_25)]" />
        <span className="size-3 rounded-full bg-[oklch(0.82_0.16_75)]" />
        <span className="size-3 rounded-full bg-[oklch(0.78_0.14_160)]" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-sm leading-relaxed">
        {lines.slice(0, visibleLines).map((line, index) => {
          const isCurrent = !instant && !done && index === cursor.line;
          const text = isCurrent ? line.text.slice(0, cursor.char) : line.text;
          const showOutput = instant || done || !isCurrent || cursor.output;

          return (
            <div key={index} className="whitespace-pre-wrap">
              <span>
                <span className="mr-2 text-primary select-none">
                  {line.prompt ?? prompt}
                </span>
                <span className="text-foreground">{text}</span>
                {isCurrent && (
                  <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-primary [animation:duck-caret_1s_step-end_infinite]" />
                )}
              </span>
              {line.output && showOutput && (
                <div className="pt-0.5 pb-2 text-muted-foreground">
                  {line.output}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Terminal };
