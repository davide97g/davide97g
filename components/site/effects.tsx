"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The page-wide micro-interactions, wired once:
 * - [data-reveal] and .heat get data-in the first time they scroll into view;
 * - [data-card] gets --mx/--my so its spotlight follows the pointer;
 * - .topbar gets data-stuck once the page scrolls under it.
 */
export function Effects() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    document.querySelectorAll("[data-reveal], .heat").forEach((el) => io.observe(el));

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>("[data-card]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    const bars = document.querySelectorAll<HTMLElement>(".topbar");
    const onScroll = () =>
      bars.forEach((b) => {
        if (window.scrollY > 8) b.dataset.stuck = "";
        else delete b.dataset.stuck;
      });

    document.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return null;
}

const fmt = new Intl.NumberFormat("en-US");

/** A number that counts up from zero the first time it is seen. Renders the final value without JS. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 1100);
        setShown(Math.round(value * (1 - (1 - p) ** 4)));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={fmt.format(value)}>
      <span aria-hidden>{fmt.format(shown)}</span>
    </span>
  );
}
