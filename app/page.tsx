import { Channel } from "@/components/site/channel";
import { Contact } from "@/components/site/contact";
import { Hero } from "@/components/site/hero";
import { SiteHeader } from "@/components/site/site-header";
import { StackSection } from "@/components/site/stack-section";
import { Trajectory } from "@/components/site/trajectory";
import { Work } from "@/components/site/work";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="relative">
        {/* A single soft lime bloom behind the hero. It is the only decoration
            on the page that is not a component. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(60%_50%_at_50%_0%,var(--primary),transparent_70%)] opacity-[0.07]"
        />
        <Hero />
        <Channel />
        <Work />
        <StackSection />
        <Trajectory />
        <Contact />
      </main>
    </>
  );
}
