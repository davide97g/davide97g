import { Section } from "@/components/site/section";
import { HudLabel } from "@/components/ui/hud-label";
import { trajectory } from "@/lib/content";

/**
 * Career, newest first. One rule per role and a lime marker on the current
 * one — no holo, because the featured project above already spent it.
 */
export function Trajectory() {
  return (
    <Section
      id="trajectory"
      label="Trajectory"
      title="Where I've built."
      lead="Five years across financial services, R&D, data science and enterprise frontend."
    >
      <ol className="flex flex-col">
        {trajectory.map((entry, index) => (
          <li
            key={`${entry.company}-${entry.period}`}
            className="group grid gap-4 border-t border-border py-8 md:grid-cols-[9rem_1fr] md:gap-10 lg:py-10"
          >
            <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
              <HudLabel
                tone={index === 0 ? "primary" : "muted"}
                dot={index === 0}
                tracking="tight"
              >
                {entry.period}
              </HudLabel>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-primary-ink sm:text-2xl">
                {entry.role}
              </h3>
              <p className="font-mono text-sm text-primary-ink">{entry.company}</p>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {entry.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
