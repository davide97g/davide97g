import { cn } from "@/lib/utils";

/** The letter of the mark — the same path as the README images (scripts/profile/svg.mjs). */
const LETTER = "M27 20h21c19.5 0 31 11.6 31 30S67.5 80 48 80H27zm13 11.5v37h7.5C59 68.5 65.5 62 65.5 50S59 31.5 47.5 31.5z";

/** A black tile with a geometric D: settles in once, a highlight crosses it on hover. */
export function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "logo-mark relative inline-flex shrink-0 overflow-hidden rounded-[24%] bg-primary text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
        <path fill="currentColor" fillRule="evenodd" d={LETTER} className="logo-letter" />
      </svg>
      <span aria-hidden className="logo-shine pointer-events-none absolute inset-0" />
    </span>
  );
}
