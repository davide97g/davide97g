import { DuckHero } from "@/components/blocks/duck-hero";
import { HoloAvatar } from "@/components/ui/holo-avatar";
import { HudLabel } from "@/components/ui/hud-label";
import { heroTerminal, links, principles, profile } from "@/lib/content";

/**
 * The first viewport. DuckHero spends the page's holo budget on its primary
 * action, so the avatar ring stays off and the eyebrow pill stays plain.
 */
export function Hero() {
  return (
    <div id="top">
      <DuckHero
        eyebrow={{
          text: profile.eyebrow,
          tag: "open to collab",
          href: links.site,
        }}
        title={
          <>
            {profile.headline[0]}
            <br />
            {profile.headline[1]}
            <br />
            <span className="text-primary-ink">{profile.headline[2]}</span>
          </>
        }
        description={profile.lead}
        primaryAction={{ label: "See the work", href: "#work" }}
        secondaryAction={{ label: "Watch the builds", href: links.youtube }}
        terminal={[...heroTerminal]}
        proof={
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <HoloAvatar
                src={profile.avatar}
                alt={profile.name}
                fallback="DG"
                ring="none"
                size="default"
              />
              <div className="flex flex-col gap-1">
                <span className="font-display text-sm font-bold tracking-tight">
                  {profile.name}
                </span>
                <HudLabel size="sm" tracking="tight">
                  Frontend Team Leader · Bitrock
                </HudLabel>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {principles.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-[0.45rem] size-1.5 shrink-0 bg-primary"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </div>
  );
}
