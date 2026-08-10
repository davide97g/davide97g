import { Section } from "@/components/site/section";
import { HoloBadge } from "@/components/ui/holo-badge";
import { StickerSheet, StickerSheetCell } from "@/components/ui/sticker-sheet";
import { stack } from "@/lib/content";

/**
 * The stack, on backing paper. Grouped by position in the system rather than
 * by how much I like each tool — the grouping is the information.
 */
export function StackSection() {
  return (
    <Section
      id="stack"
      label="Stack"
      title="What I work with."
      lead="Grouped by where it sits in the system, not by preference."
    >
      <StickerSheet label="stack · 5 groups">
        {stack.map((group, index) => (
          <StickerSheetCell
            key={group.name}
            label={group.name.toLowerCase()}
            // Five groups in a three-column grid leaves a hole; the last one
            // takes the remaining two columns so the sheet stays a rectangle.
            span={index === stack.length - 1 ? 2 : 1}
          >
            {group.items.map((item) => (
              <HoloBadge key={item} variant="outline">
                {item}
              </HoloBadge>
            ))}
          </StickerSheetCell>
        ))}
      </StickerSheet>
    </Section>
  );
}
