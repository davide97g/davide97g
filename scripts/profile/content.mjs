/**
 * The curated half of the profile README. Everything numeric (contributions,
 * recent pushes, videos) comes from the snapshot instead.
 */

export const LOGIN = "davide97g";
export const YOUTUBE_CHANNEL_ID = "UCp-6Cv5ksm2mY-xLJqvLVKw";

export const hero = {
  name: "Davide Ghiotto",
  meta: "@davide97g · Vicenza, IT",
  status: "Open to collab",
  headline: ["Building with agents,", "in public."],
  lead: "Frontend Team Leader at Bitrock. Five years shipping enterprise platforms — now LLM systems and agent architectures, streamed on YouTube.",
  chips: ["Frontend lead · Bitrock", "Agent-native", "IT · EN"],
  /** The black card cycles through these, one every few seconds. */
  now: [
    { label: "Building", title: "Sharp", detail: "The self-hosted Slack, in Rust" },
    { label: "Shipping", title: "Autocratico", detail: "A register for Italian bureaucracy" },
    { label: "Streaming", title: "@davideghi", detail: "Every build, live on YouTube" },
  ],
};

export const links = [
  { id: "site", label: "davideghiotto.it", icon: "globe", href: "https://davideghiotto.it", primary: true },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/davide-ghiotto/" },
  { id: "youtube", label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@davideghi?sub_confirmation=1" },
  { id: "instagram", label: "Instagram", icon: "instagram", href: "https://www.instagram.com/ai_quack/" },
  { id: "email", label: "Email", icon: "mail", href: "mailto:dacoderit@gmail.com" },
];

export const work = [
  {
    id: "autocratico",
    title: "Autocratico",
    status: "Open source",
    year: "2026",
    description:
      "A private register for Italian bureaucracy. An always-on Claude Code agent files mail, scans and chats into plain-text deadlines and cases.",
    tags: ["Hono", "React", "Claude Code"],
    href: "https://autocratico.it",
  },
  {
    id: "duckui",
    title: "duck/ui",
    status: "Live",
    year: "2026",
    description:
      "My design system. Dark-first, holographic accents used sparingly, distributed as a shadcn registry: components are copied in, not imported.",
    tags: ["Next.js", "Tailwind v4", "shadcn"],
    href: "https://duckui.davideghiotto.it",
  },
  {
    id: "thumb",
    title: "Thumb Studio",
    status: "Live",
    year: "2025",
    description:
      "Local-first YouTube thumbnail editor. Layer stack, in-browser background removal, parametric backgrounds, one-click PNG export. No backend.",
    tags: ["React 19", "TypeScript", "Vite"],
    href: "https://thumb.davideghiotto.it",
  },
  {
    id: "channeling",
    title: "Channeling",
    status: "Private",
    year: "2026",
    description:
      "A personal signal archive. Answers from the videos I watch and the notes I keep, with citations back to the exact source and second.",
    tags: ["RAG", "TypeScript", "Graph UI"],
    href: "https://channeling.davideghiotto.it",
  },
];

export const sections = {
  activity: { index: "01", title: "Activity", detail: "Straight from the GitHub API, refreshed every day" },
  work: { index: "02", title: "Work", detail: "Four things I ship and keep running" },
  channel: { index: "03", title: "Channel", detail: "Latest uploads on @davideghi" },
};
