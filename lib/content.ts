/**
 * Every string the page renders. Kept in one module so the sections stay
 * layout-only and the copy can be edited without reading JSX.
 *
 * Numbers (contributions, pushes, videos) are not here: they come from the
 * daily snapshot in assets/profile/snapshot.json, see lib/snapshot.ts.
 */

export const profile = {
  name: "Davide Ghiotto",
  handle: "davide97g",
  meta: "Vicenza, IT",
  role: "Frontend Team Leader · Bitrock",
  status: "Open to collab",
  headline: ["Building with agents,", "in public."],
  lead: "Five years shipping enterprise platforms. Now wiring LLM systems and agent architectures into production — and streaming the whole build on YouTube.",
  chips: ["Frontend lead · Bitrock", "Agent-native", "IT · EN"],
  email: "dacoderit@gmail.com",
} as const;

export const links = {
  site: "https://davideghiotto.it",
  github: "https://github.com/davide97g",
  youtube: "https://www.youtube.com/@davideghi",
  youtubeSubscribe: "https://www.youtube.com/@davideghi?sub_confirmation=1",
  linkedin: "https://www.linkedin.com/in/davide-ghiotto/",
  instagram: "https://www.instagram.com/ai_quack/",
  email: "mailto:dacoderit@gmail.com",
} as const;

export const sections = [
  { id: "overview", label: "Overview" },
  { id: "activity", label: "Activity" },
  { id: "work", label: "Work" },
  { id: "channel", label: "Channel" },
  { id: "trajectory", label: "Trajectory" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** The black card cycles through these, one every few seconds. */
export const now = [
  { label: "Building", title: "Sharp", detail: "The self-hosted Slack, in Rust", href: "https://sharp.davideghiotto.it/" },
  { label: "Shipping", title: "Autocratico", detail: "A register for Italian bureaucracy", href: "https://autocratico.it" },
  { label: "Streaming", title: "@davideghi", detail: "Every build, live on YouTube", href: "https://www.youtube.com/@davideghi" },
] as const;

export type ProjectStatus = "Live" | "Open source" | "Private";

export interface Project {
  title: string;
  description: string;
  tags: readonly string[];
  year: string;
  status: ProjectStatus;
  href: string;
  linkLabel: string;
}

export const projects: readonly Project[] = [
  {
    title: "Autocratico",
    status: "Open source",
    year: "2026",
    description:
      "A private register for Italian bureaucracy. An always-on Claude Code agent files mail, scans and chats into plain-text deadlines and cases — every change a git commit you can undo.",
    tags: ["Hono", "React", "Claude Code"],
    href: "https://autocratico.it",
    linkLabel: "autocratico.it",
  },
  {
    title: "Sharp",
    status: "Open source",
    year: "2026",
    description:
      "The self-hosted Slack alternative. Chat, docs, canvas and tasks behind one permission model on a VPS I own. Sharpy, the assistant, runs RAG that never answers with what you could not open.",
    tags: ["Rust (axum)", "Postgres + pgvector", "Tauri 2"],
    href: "https://sharp.davideghiotto.it/",
    linkLabel: "sharp.davideghiotto.it",
  },
  {
    title: "duck/ui",
    status: "Live",
    year: "2026",
    description:
      "My design system. Dark-first, holographic accents used sparingly, distributed as a shadcn registry: components are copied into a project, not imported from a package.",
    tags: ["Next.js", "Tailwind v4", "shadcn"],
    href: "https://duckui.davideghiotto.it/",
    linkLabel: "duckui.davideghiotto.it",
  },
  {
    title: "Thumb Studio",
    status: "Live",
    year: "2025",
    description:
      "Local-first YouTube thumbnail editor. Layer stack, in-browser background removal, parametric backgrounds, one-click PNG export. No backend.",
    tags: ["React 19", "TypeScript", "Vite"],
    href: "https://thumb.davideghiotto.it/",
    linkLabel: "thumb.davideghiotto.it",
  },
  {
    title: "Channeling",
    status: "Private",
    year: "2026",
    description:
      "A personal signal archive. Answers from the videos I watch and the notes I keep, with citations back to the exact source and second — walkable as a graph.",
    tags: ["RAG", "TypeScript", "Graph UI"],
    href: "https://channeling.davideghiotto.it/",
    linkLabel: "channeling.davideghiotto.it",
  },
  {
    title: "Pulse HR",
    status: "Open source",
    year: "2026",
    description:
      "People-first HR platform. Async status logs, kudos, growth and wellbeing with manager-safe sentiment: raw signals stay with the employee, managers see trends.",
    tags: ["TypeScript", "Bun", "Hono"],
    href: "https://github.com/davide97g/pulse-hr",
    linkLabel: "github.com/davide97g/pulse-hr",
  },
];

export const stack = [
  { name: "Frontend", items: ["React", "Next.js", "Angular", "Vue 3", "TypeScript"] },
  { name: "Backend", items: ["Node.js", "Rust", "Java (Spring)", ".NET", "Python"] },
  { name: "Data", items: ["PostgreSQL", "pgvector", "MongoDB", "Oracle"] },
  { name: "Agents", items: ["Claude Code", "Codex", "Cursor", "MCP"] },
] as const;

export const trajectory = [
  {
    role: "Frontend Team Leader",
    company: "Bitrock",
    period: "2023 —",
    description:
      "Leading 5 developers on a large enterprise booking system built from independent React micro-frontends. Shipped a fleet management app on Next.js and Supabase, and Sonarflow, which fixes SonarQube issues with AI.",
  },
  {
    role: "Data Scientist",
    company: "Infodati",
    period: "2022 — 2023",
    description: "Predicted customer scores and opportunity outcomes with Python and machine learning, inside the Qlik ecosystem.",
  },
  {
    role: "R&D Full-Stack Developer",
    company: "Namirial",
    period: "2021 — 2022",
    description: "Cross-platform apps with Vue 3, Electron and .NET 6: a digital signature application and a license manager.",
  },
  {
    role: "Full-Stack Developer",
    company: "Reply — Core Financial Services",
    period: "2019 — 2021",
    description: "Angular on the frontend, Java microservices on the backend, Oracle and MySQL underneath.",
  },
] as const;

export const principles = [
  "Developer experience is a product feature",
  "Clarity over cleverness",
  "Agents type, I architect and review",
] as const;
