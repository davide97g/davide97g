import { ActivitySection } from "@/components/site/activity";
import { ChannelSection } from "@/components/site/channel";
import { ContactSection } from "@/components/site/contact";
import { Overview } from "@/components/site/overview";
import { Shell } from "@/components/site/shell";
import { TrajectorySection } from "@/components/site/trajectory";
import { WorkSection } from "@/components/site/work";

export default function Page() {
  return (
    <Shell>
      <Overview />
      <ActivitySection />
      <WorkSection />
      <ChannelSection />
      <TrajectorySection />
      <ContactSection />
    </Shell>
  );
}
