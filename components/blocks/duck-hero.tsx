import * as React from "react";

import { cn } from "@/lib/utils";
import { Announcement } from "@/components/ui/announcement";
import { HoloButton } from "@/components/ui/holo-button";
import { Terminal, type TerminalLine } from "@/components/ui/terminal";

/**
 * DuckHero — the landing section: announcement pill, display headline, two
 * actions and a self-typing terminal beside them.
 *
 * The holo budget of the whole viewport is spent here, on the primary action.
 * Everything below the fold gets lime. Pass `aside` to swap the terminal for
 * a screenshot, an illustration or whatever the product actually is.
 */
export interface DuckHeroAction {
  label: string;
  href: string;
}

export interface DuckHeroProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  /** The pill above the headline. Give it an href and it grows an arrow. */
  eyebrow?: { text: string; tag?: string; href?: string };
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The one holo element on the page. */
  primaryAction?: DuckHeroAction;
  secondaryAction?: DuckHeroAction;
  /** Right column. Ignored when `aside` is set. */
  terminal?: TerminalLine[];
  /** Replaces the terminal entirely. */
  aside?: React.ReactNode;
  /** Sits under the actions: stats, logos, an avatar row. */
  proof?: React.ReactNode;
}

function DuckHero({
  className,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  terminal,
  aside,
  proof,
  ...props
}: DuckHeroProps) {
  const visual =
    aside ?? (terminal ? <Terminal lines={terminal} className="w-full" /> : null);

  return (
    // The `@container` has to sit on an ancestor of the element that queries
    // it: a container query never reads the container it is declared on, so
    // `@container` and `@4xl:` on one element leaves the hero single-column at
    // every width. The padded shell is the container; the grid is inside it.
    <div className="@container mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <section
        data-slot="duck-hero"
        className={cn(
          // Container queries, not viewport ones: a hero dropped inside a padded
          // shell should respond to the space it actually got.
          "grid w-full items-center gap-12 pt-12 pb-20",
          "lg:gap-8 lg:pt-20 lg:pb-28",
          visual && "@4xl:grid-cols-[1.05fr_0.95fr]",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-start gap-7">
          {eyebrow && (
            <Announcement tag={eyebrow.tag} href={eyebrow.href}>
              {eyebrow.text}
            </Announcement>
          )}

          <h1
            className={cn(
              "font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance",
              "sm:text-6xl lg:text-7xl"
            )}
          >
            {title}
          </h1>

          {description && (
            <p className="max-w-md text-lg text-pretty text-muted-foreground">
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {primaryAction && (
                <HoloButton asChild size="lg">
                  <a href={primaryAction.href}>{primaryAction.label}</a>
                </HoloButton>
              )}
              {secondaryAction && (
                <HoloButton asChild variant="outline" size="lg">
                  <a href={secondaryAction.href}>{secondaryAction.label}</a>
                </HoloButton>
              )}
            </div>
          )}

          {proof && <div className="pt-1">{proof}</div>}
        </div>

        {visual && (
          <div className="flex w-full justify-center @4xl:justify-end">
            {visual}
          </div>
        )}
      </section>
    </div>
  );
}

export { DuckHero };
