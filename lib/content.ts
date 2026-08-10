/**
 * Every string the page renders. Kept in one module so the sections stay
 * layout-only and the copy can be edited without reading JSX.
 *
 * Content mirrors davideghiotto.it — same roles, same projects, same stack —
 * so the profile page and the personal site tell one story.
 */

export const profile = {
  name: "Davide Ghiotto",
  handle: "davide97g",
  eyebrow: "Full-stack engineer · Frontend lead · Italy",
  headline: ["Building", "with agents,", "in public."],
  lead: "Five years shipping enterprise platforms. Now wiring LLM systems and agent architectures into production — and streaming the whole build on YouTube.",
  avatar: "https://github.com/davide97g.png",
  email: "dacoderit@gmail.com",
} as const;

export const links = {
  site: "https://davideghiotto.it",
  github: "https://github.com/davide97g",
  youtube: "https://www.youtube.com/@davideghi",
  youtubeSubscribe: "https://www.youtube.com/@davideghi?sub_confirmation=1",
  duckui: "https://duckui.davideghiotto.it",
  email: "mailto:dacoderit@gmail.com",
} as const;

export const nav = [
  { label: "Channel", href: "#channel" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#stack" },
  { label: "Trajectory", href: "#trajectory" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * The hero terminal. Output rides on the line that produced it — a line with
 * an empty `text` prints a bare prompt with nothing after it.
 */
export const heroTerminal = [
  {
    prompt: "~",
    text: "claude --agents 4 'ship the feature'",
    output: "planning · 4 subagents dispatched",
  },
  {
    prompt: "~",
    text: "pnpm test && pnpm build",
    output: "✓ 218 passed · build ready in 6.4s",
  },
  { prompt: "~", text: "git push && obs --go-live" },
] as const;

export const channel = {
  title: "I build on camera, weekly.",
  lead: "Live coding, agent workflows and honest model comparisons — no hype, and no editing that fakes the rhythm of real development.",
  stats: [
    { label: "Cadence", value: "Weekly live" },
    { label: "Format", value: "Unedited builds" },
    { label: "Language", value: "IT · EN" },
  ],
  videos: [
    {
      videoId: "LdvKveiykjg",
      title: "Claude Art Online — Teaser (Fable 5 x Blender)",
      duration: "0:39",
    },
    {
      videoId: "NTtPD1Olpwo",
      title: "Provo TUTTI i tool di VIBECODING + TIER LIST",
      duration: "23:16",
    },
    {
      videoId: "-XmrA0TF__U",
      title: "Come pubblicare la tua web app FREE + FAST + EASY",
      duration: "15:53",
    },
  ],
} as const;

export interface Project {
  title: string;
  description: string;
  tags: readonly string[];
  year: string;
  href: string;
  linkLabel: string;
  badge?: string;
}

/** The one project that carries the section's holo budget. */
export const featured = {
  title: "Sharp",
  tagline: "The self-hosted Slack alternative.",
  description:
    "One workspace instead of four tools: chat, docs, canvas and tasks behind a single permission model, running on a VPS I own. Sharpy, the built-in assistant, runs RAG over the workspace and never answers with something the reader could not open themselves.",
  features: [
    "Chat, threads & DMs with presence and full-text search",
    "Collaborative docs with real-time co-editing (Yjs)",
    "Infinite canvas and kanban boards",
    "Tasks with GitHub sync, calendar with Google sync",
    "Optional end-to-end encrypted DMs and passkeys",
    "Sharpy: workspace RAG that respects permissions",
  ],
  stack: [
    "Rust (axum)",
    "Postgres 16 + pgvector",
    "Redis",
    "LiveKit",
    "React",
    "Vite",
    "Tauri 2",
    "Astro",
  ],
  href: "https://sharp.davideghiotto.it/",
  repo: "https://github.com/davide97g/sharp",
} as const;

export const projects: readonly Project[] = [
  {
    title: "duck/ui",
    description:
      "The design system this page is built with. Dark-first canvas, duck-lime primary, holographic accents used sparingly — shipped as a shadcn registry so components are copied into a project rather than imported from a package.",
    tags: ["Next.js", "Tailwind v4", "shadcn registry"],
    year: "2026 —",
    href: "https://duckui.davideghiotto.it/",
    linkLabel: "duckui.davideghiotto.it",
  },
  {
    title: "Thumb Studio",
    description:
      "Browser thumbnail editor for the channel, built because every generic design tool fights the 1280×720 workflow. Layer stack, reusable asset library, autosaved project archive and one-click PNG export — with backgrounds from a parametric generator.",
    tags: ["React 19", "TypeScript", "Vite"],
    year: "2025 —",
    href: "https://thumb.davideghiotto.it/",
    linkLabel: "thumb.davideghiotto.it",
  },
  {
    title: "Channeling",
    description:
      "A personal signal archive. It ingests the videos I watch and the notes I keep, then answers with citations back to the exact source and timestamp — every claim traceable to a video second or a topic file, all of it walkable as a force-directed graph.",
    tags: ["RAG", "TypeScript", "Graph UI"],
    year: "2026 —",
    href: "https://channeling.davideghiotto.it/",
    linkLabel: "channeling.davideghiotto.it",
    badge: "Private repo",
  },
  {
    title: "Pulse HR",
    description:
      "Open-source, people-first HR platform. Async status logs, kudos, growth and wellbeing with manager-safe sentiment — raw signals stay with the employee, managers see aggregated trends.",
    tags: ["TypeScript", "Bun", "Hono"],
    year: "2026 —",
    href: "https://github.com/davide97g/pulse-hr",
    linkLabel: "github.com/davide97g/pulse-hr",
  },
  {
    title: "Sonarflow",
    description:
      "AI-enhanced code quality CLI. Extends an open-source SonarQube CLI with assisted issue resolution: automated fetching and analysis from SonarQube/SonarCloud, fix suggestions wired into the developer workflow. Distributed on npm.",
    tags: ["Node.js", "TypeScript", "SonarQube"],
    year: "2025 —",
    href: "https://github.com/davide97g/sonarflow",
    linkLabel: "github.com/davide97g/sonarflow",
  },
  {
    title: "Bitcompass",
    description:
      "Modular web architecture toolkit for bootstrapping scalable applications: standardized structure, TypeScript, a modern build setup and Supabase for auth and backend services. Built to accelerate setup and enforce code quality across teams.",
    tags: ["TypeScript", "React", "Supabase"],
    year: "2026 —",
    href: "https://github.com/davide97g/bitcompass",
    linkLabel: "github.com/davide97g/bitcompass",
  },
];

export const stack = [
  {
    name: "Frontend",
    items: ["React", "Next.js", "Angular", "Vue 3", "TypeScript"],
  },
  { name: "Backend", items: ["Node.js", "Java (Spring)", ".NET", "Python"] },
  { name: "Databases", items: ["PostgreSQL", "MongoDB", "Oracle", "MySQL"] },
  {
    name: "Cloud & DevOps",
    items: ["Supabase", "Firebase", "AWS", "GitHub Actions", "Jenkins"],
  },
  {
    name: "AI & Data",
    items: ["Claude Code", "Codex", "TensorFlow", "Scikit-learn", "Pandas"],
  },
] as const;

export const trajectory = [
  {
    role: "Frontend Team Leader",
    company: "Bitrock",
    period: "2023 —",
    description:
      "Leading 5 developers on a large enterprise booking system built from independent React micro-frontends. Built a full-stack vehicle fleet management app with Next.js and Supabase, and Sonarflow — an AI-powered framework that fixes SonarQube issues automatically.",
  },
  {
    role: "Data Scientist",
    company: "Infodati",
    period: "2022 — 2023",
    description:
      "Predicted customer scores and opportunity outcomes with Python and machine learning, integrating the models inside the Qlik ecosystem.",
  },
  {
    role: "R&D Full-Stack Developer",
    company: "Namirial",
    period: "2021 — 2022",
    description:
      "Cross-platform applications with Vue 3, Electron and .NET 6 — a digital signature application and a license manager. Agile Scrum.",
  },
  {
    role: "Full-Stack Developer & Database Manager",
    company: "Reply S.p.A — Cluster & Core Financial Services",
    period: "2019 — 2021",
    description:
      "Angular on the frontend, Java microservices on the backend, Oracle and MySQL underneath.",
  },
] as const;

export const principles = [
  "Developer experience is a product feature",
  "Performance and architectural clarity over cleverness",
  "AI-assisted workflows: Claude Code, Codex, Cursor, Cline",
] as const;
