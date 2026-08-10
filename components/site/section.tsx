import * as React from "react";

import { cn } from "@/lib/utils";
import { HudLabel } from "@/components/ui/hud-label";

/**
 * The shell every section below the hero shares: HUD index, display heading,
 * one lead paragraph, then content. Having it in one place is what keeps the
 * page reading as a single document rather than six stacked landing pages.
 */
export function Section({
  id,
  label,
  title,
  lead,
  actions,
  className,
  children,
}: {
  id: string;
  label: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28",
        className
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <HudLabel tone="primary" dot>
            {label}
          </HudLabel>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {lead && (
            <p className="text-base text-pretty text-muted-foreground sm:text-lg">
              {lead}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <div className="pt-12">{children}</div>
    </section>
  );
}
