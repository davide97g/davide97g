/**
 * The daily GitHub + YouTube snapshot written by scripts/profile/generate.mjs,
 * read at build time. Every relative date is computed against the moment the
 * snapshot was taken, so the static export renders the same on every load.
 */
import data from "@/assets/profile/snapshot.json";

export interface Day {
  date: string;
  count: number;
}

export interface Snapshot {
  generatedAt: string;
  user: {
    name: string;
    login: string;
    location: string;
    createdAt: string;
    followers: number;
    following: number;
    publicRepos: number;
  };
  contributions: {
    total: number;
    commits: number;
    pullRequests: number;
    issues: number;
    weeks: Day[][];
  };
  recent: {
    name: string;
    description: string | null;
    url: string;
    language: string | null;
    stars: number;
    pushedAt: string;
  }[];
  videos: { id: string; title: string; published: string; views: number }[];
}

export const snapshot = data as Snapshot;

const DAY = 86_400_000;

export function ago(iso: string, now = snapshot.generatedAt) {
  const days = Math.floor((Date.parse(now) - Date.parse(iso)) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days}d ago`;
  if (days < 60) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

export function shortDate(iso: string, withYear = true) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}

/** GitHub-style quartiles over the non-zero days, 0–4. */
export function levelScale(days: Day[]) {
  const nonzero = days.map((d) => d.count).filter(Boolean).sort((a, b) => a - b);
  const q = (p: number) => nonzero[Math.floor(p * (nonzero.length - 1))] ?? 1;
  const [a, b, c] = [q(0.25), q(0.5), q(0.75)];
  return (n: number) => (n === 0 ? 0 : n <= a ? 1 : n <= b ? 2 : n <= c ? 3 : 4);
}

/** The longest run of consecutive days with at least one contribution. */
export function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    run = d.count ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

export const today = snapshot.generatedAt.slice(0, 10);
