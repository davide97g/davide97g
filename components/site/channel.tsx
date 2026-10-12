import { ArrowUpRight, Play } from "lucide-react";

import { links } from "@/lib/content";
import { ago, snapshot } from "@/lib/snapshot";

import { Card, Section } from "./section";

const WEEK = 7 * 86_400_000;
const fmt = new Intl.NumberFormat("en-US");

export function ChannelSection() {
  return (
    <Section
      id="channel"
      index="03"
      title="Channel"
      detail="Latest uploads on @davideghi"
      action={
        <a
          href={links.youtubeSubscribe}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px"
        >
          Subscribe <ArrowUpRight className="nudge size-3.5" aria-hidden />
        </a>
      }
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {snapshot.videos.map((v, i) => {
          const fresh = i === 0 && Date.parse(snapshot.generatedAt) - Date.parse(v.published) < WEEK;
          return (
            <Card as="li" key={v.id} className="group" style={{ "--i": i }}>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} className="flex h-full flex-col rounded-3xl p-3">
                <span className="relative block aspect-video overflow-hidden rounded-2xl bg-muted">
                  {/* Grey until hovered: the page stays monochrome, the video keeps its colour. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    width={320}
                    height={180}
                    className="size-full object-cover grayscale transition-[filter,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent to-50%" />
                  <span
                    aria-hidden
                    className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-110"
                  >
                    <Play className="size-3.5 translate-x-px fill-current" />
                  </span>
                  {fresh && (
                    <span className="absolute top-3 right-3 rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-black">
                      NEW
                    </span>
                  )}
                </span>
                <span className="mt-3 line-clamp-2 px-1 text-[15px] leading-snug font-medium">{v.title}</span>
                <span className="mt-auto px-1 pt-3 pb-1 font-mono text-[11px] text-muted-foreground">
                  {fmt.format(v.views)} views · {ago(v.published)}
                </span>
              </a>
            </Card>
          );
        })}
      </ul>
    </Section>
  );
}
