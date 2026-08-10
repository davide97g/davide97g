import { ArrowUpRight, Github } from "lucide-react";

import { Section } from "@/components/site/section";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerCard,
  StickerCardContent,
  StickerCardDescription,
  StickerCardFooter,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";
import { featured, projects } from "@/lib/content";

/**
 * Projects. The featured card is the section's one holo element, so its own
 * buttons stay lime — a holo control inside a holo ring reads as a bug.
 */
export function Work() {
  return (
    <Section
      id="work"
      label="Work"
      title="What I ship."
      lead="Open-source tools and platforms, mostly built in the open."
    >
      <StickerCard holo className="mb-10 overflow-hidden">
        <StickerCardHeader className="gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <HudLabel tone="primary" tracking="tight">
              Current focus
            </HudLabel>
            <HoloBadge variant="muted">Self-hosted</HoloBadge>
          </div>
          <StickerCardTitle className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {featured.title} — {featured.tagline}
          </StickerCardTitle>
          <StickerCardDescription className="max-w-3xl text-base">
            {featured.description}
          </StickerCardDescription>
        </StickerCardHeader>

        <StickerCardContent className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-3">
            <HudLabel size="sm" tracking="tight">
              Inside
            </HudLabel>
            <ul className="flex flex-col gap-2">
              {featured.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45rem] size-1.5 shrink-0 bg-primary"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <HudLabel size="sm" tracking="tight">
              Built with
            </HudLabel>
            <div className="flex flex-wrap gap-2">
              {featured.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </StickerCardContent>

        <StickerCardFooter className="flex-wrap gap-3">
          <QuackButton asChild variant="primary">
            <a href={featured.href} target="_blank" rel="noopener">
              Open sharp
              <ArrowUpRight className="size-4" />
            </a>
          </QuackButton>
          <QuackButton asChild variant="outline">
            <a href={featured.repo} target="_blank" rel="noopener">
              <Github className="size-4" />
              Source
            </a>
          </QuackButton>
        </StickerCardFooter>
      </StickerCard>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <StickerCard
            key={project.title}
            tilt
            className="group h-full transition-[border-color] duration-300 hover:border-primary/50"
          >
            <StickerCardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <HudLabel size="sm" tracking="tight">
                  {project.year}
                </HudLabel>
                {project.badge && (
                  <HoloBadge variant="muted">{project.badge}</HoloBadge>
                )}
              </div>
              <StickerCardTitle className="font-display text-xl font-bold tracking-tight">
                {project.title}
              </StickerCardTitle>
              <StickerCardDescription>
                {project.description}
              </StickerCardDescription>
            </StickerCardHeader>

            <StickerCardContent className="mt-auto flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <HoloBadge key={tag} variant="outline">
                  {tag}
                </HoloBadge>
              ))}
            </StickerCardContent>

            <StickerCardFooter>
              <a
                href={project.href}
                target="_blank"
                rel="noopener"
                className="hud inline-flex items-center gap-2 text-primary-ink transition-colors hover:text-foreground"
              >
                {project.linkLabel}
                <ArrowUpRight className="size-3.5" />
              </a>
            </StickerCardFooter>
          </StickerCard>
        ))}
      </div>
    </Section>
  );
}
