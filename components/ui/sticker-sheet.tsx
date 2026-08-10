import * as React from "react";

import { cn } from "@/lib/utils";
import { HudLabel } from "@/components/ui/hud-label";

/**
 * StickerSheet — backing paper with kiss-cut lines. Lays out a set of
 * components the way a vinyl sheet lays out stickers: one grid, visible cut
 * lines, everything sitting on the same surface.
 */
function StickerSheet({
  className,
  children,
  label,
  ...props
}: React.ComponentProps<"div"> & {
  /** Small caption printed in the sheet margin. */
  label?: string;
}) {
  return (
    <div
      data-slot="sticker-sheet"
      className={cn(
        "kiss-cut sticker relative overflow-hidden rounded-2xl border-border",
        className
      )}
      {...props}
    >
      {label && (
        <HudLabel size="sm" tracking="tight" className="absolute top-3 right-4 z-1">
          {label}
        </HudLabel>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}

/**
 * StickerSheetCell — one kiss-cut cell. Its content sits centered on the
 * backing so the component itself reads as the sticker.
 */
function StickerSheetCell({
  className,
  children,
  label,
  span,
  ...props
}: React.ComponentProps<"div"> & {
  label?: string;
  /** Cell width in grid columns at lg and up. */
  span?: 1 | 2 | 3;
}) {
  return (
    <div
      data-slot="sticker-sheet-cell"
      className={cn(
        "-mt-px -ml-px flex min-h-44 flex-col items-center justify-center gap-4 border border-dashed border-cut p-6",
        span === 2 && "lg:col-span-2",
        span === 3 && "lg:col-span-3",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3">
        {children}
      </div>
      {/* Not a HudLabel: a cell caption names the component sitting in it, and
          those names are lowercase identifiers. Uppercasing them would print
          QUACK-BUTTON on a sheet whose whole job is to be scanned. */}
      {label && (
        <span className="font-mono text-[11px] text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

export { StickerSheet, StickerSheetCell };
