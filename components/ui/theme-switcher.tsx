"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

/** Button box (size-7) plus the gap between buttons (gap-1), in px. The pill
 * slides by exactly this, so the geometry can only ever be edited in one place. */
const STEP = 28 + 4;

/**
 * ThemeSwitcher — a three-way segmented control. The lime pill slides to the
 * active option so the change reads as movement, not a repaint.
 *
 * Requires a next-themes ThemeProvider above it.
 */
function ThemeSwitcher({
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children">) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === (mounted ? theme : "system"))
  );

  return (
    <div
      data-slot="theme-switcher"
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "relative inline-flex items-center gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute top-1 left-1 size-7 rounded-full bg-primary transition-transform duration-400 ease-[var(--ease-duck)]"
        style={{
          transform: `translateX(${activeIndex * STEP}px)`,
          opacity: mounted ? 1 : 0,
        }}
      />
      {options.map(({ value, label, Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative grid size-7 cursor-pointer place-items-center rounded-full transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

export { ThemeSwitcher };
