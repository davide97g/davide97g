import { Youtube } from "lucide-react";

import { Section } from "@/components/site/section";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerCarousel } from "@/components/ui/sticker-carousel";
import { VideoCard } from "@/components/ui/video-card";
import { channel, links } from "@/lib/content";

/**
 * The channel. Cards link out to YouTube rather than embedding a player, so
 * nothing here loads a third-party iframe before the visitor asks for one.
 */
export function Channel() {
  return (
    <Section
      id="channel"
      label="Channel"
      title={channel.title}
      lead={channel.lead}
      actions={
        <QuackButton asChild variant="primary" size="lg" idle="breathe">
          <a href={links.youtubeSubscribe} target="_blank" rel="noopener">
            <Youtube className="size-4" />
            Subscribe on YouTube
          </a>
        </QuackButton>
      }
    >
      <dl className="mb-12 grid grid-cols-1 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {channel.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 p-6">
            <dt>
              <HudLabel size="sm" tracking="tight">
                {stat.label}
              </HudLabel>
            </dt>
            <dd className="font-display text-xl font-bold tracking-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <StickerCarousel label="Latest uploads" controls="edge" peek>
        {channel.videos.map((video) => (
          <div key={video.videoId} className="w-[19rem] shrink-0 snap-start sm:w-[22rem]">
            <VideoCard
              videoId={video.videoId}
              title={video.title}
              duration={video.duration}
              channel="@davideghi"
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
            />
          </div>
        ))}
      </StickerCarousel>
    </Section>
  );
}
