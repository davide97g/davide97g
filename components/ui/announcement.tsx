import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const announcementClasses = [
  "group/announcement relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full",
  "border border-border bg-card/70 py-1 pr-3 pl-1 text-sm text-muted-foreground backdrop-blur",
  "transition-[border-color,color] duration-300 ease-[var(--ease-duck)]",
  "after:pointer-events-none after:absolute after:inset-0",
  "after:bg-[linear-gradient(105deg,transparent_40%,oklch(1_0_0/0.18)_48%,transparent_56%)]",
  "after:bg-[length:250%_100%] after:[animation:duck-sheen_6s_ease-in-out_infinite]",
];

/**
 * Announcement — a pill banner for one piece of news. A light sweeps across
 * it on a slow loop so it reads as live without demanding attention.
 */
function Announcement({
  className,
  children,
  tag,
  href,
  arrow,
  ...props
}: React.ComponentProps<"a"> & {
  /** Short label in the leading chip, for example "new". */
  tag?: string;
  arrow?: boolean;
}) {
  const showArrow = arrow ?? Boolean(href);

  const content = (
    <>
      {tag && (
        <span className="relative rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {tag}
        </span>
      )}
      <span className="relative">{children}</span>
      {showArrow && (
        <ArrowRight className="relative size-3.5 transition-transform duration-300 ease-[var(--ease-duck)] group-hover/announcement:translate-x-0.5" />
      )}
    </>
  );

  if (!href) {
    return (
      <div
        data-slot="announcement"
        className={cn(announcementClasses, !tag && "pl-3", className)}
      >
        {content}
      </div>
    );
  }

  return (
    <a
      data-slot="announcement"
      href={href}
      className={cn(
        announcementClasses,
        !tag && "pl-3",
        "cursor-pointer hover:border-primary/60 hover:text-foreground",
        className
      )}
      {...props}
    >
      {content}
    </a>
  );
}

export { Announcement };
