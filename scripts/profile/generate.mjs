#!/usr/bin/env node
/**
 * Builds the profile README and every image in it from a fresh snapshot of
 * GitHub and YouTube data.
 *
 *   node scripts/profile/generate.mjs            fetch, then render
 *   node scripts/profile/generate.mjs --offline  re-render the committed snapshot
 *
 * Token: GITHUB_TOKEN or GH_TOKEN, else `gh auth token`. The Action runs this
 * daily and commits whatever changed.
 */
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as cards from "./cards.mjs";
import * as content from "./content.mjs";
import { THEMES } from "./svg.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = join(ROOT, "assets/profile");
const SNAPSHOT = join(OUT, "snapshot.json");
const THUMBS = join(OUT, "thumbs");

/* ───────────────────────── data ───────────────────────── */

const QUERY = `query($login: String!) {
  user(login: $login) {
    name login location createdAt
    followers { totalCount }
    following { totalCount }
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC, first: 30, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes { name description url stargazerCount isFork isArchived pushedAt primaryLanguage { name } }
    }
    contributionsCollection {
      totalCommitContributions totalPullRequestContributions totalIssueContributions
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } }
    }
  }
}`;

function token() {
  const env = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (env) return env;
  return execSync("gh auth token", { encoding: "utf8" }).trim();
}

async function github() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { authorization: `bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { login: content.LOGIN } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GitHub: ${JSON.stringify(json.errors ?? json)}`);
  return json.data.user;
}

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m);

/** Geist has no emoji, and colour emoji would break the monochrome anyway. */
const plain = (s) =>
  s
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

async function youtube() {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${content.YOUTUBE_CHANNEL_ID}`);
  if (!res.ok) throw new Error(`YouTube feed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, e]) => ({
    id: e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)[1],
    title: plain(decode(e.match(/<title>(.*?)<\/title>/)[1])),
    published: e.match(/<published>(.*?)<\/published>/)[1],
    views: Number(e.match(/views="(\d+)"/)?.[1] ?? 0),
  }));
}

async function fetchSnapshot() {
  const [user, videos] = await Promise.all([github(), youtube()]);
  const c = user.contributionsCollection;
  return {
    generatedAt: new Date().toISOString(),
    user: {
      name: user.name,
      login: user.login,
      location: user.location,
      createdAt: user.createdAt,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      publicRepos: user.repositories.totalCount,
    },
    contributions: {
      total: c.contributionCalendar.totalContributions,
      commits: c.totalCommitContributions,
      pullRequests: c.totalPullRequestContributions,
      issues: c.totalIssueContributions,
      weeks: c.contributionCalendar.weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))),
    },
    // The profile repo itself is pushed by the daily job, so it would always be first.
    recent: user.repositories.nodes
      .filter((r) => !r.isFork && !r.isArchived && r.name !== content.LOGIN)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.url,
        language: r.primaryLanguage?.name ?? null,
        stars: r.stargazerCount,
        pushedAt: r.pushedAt,
      })),
    videos: videos.slice(0, 3),
  };
}

async function fetchThumbs(videos) {
  mkdirSync(THUMBS, { recursive: true });
  const keep = new Set(videos.map((v) => `${v.id}.jpg`));
  for (const f of readdirSync(THUMBS)) if (!keep.has(f)) rmSync(join(THUMBS, f));
  for (const v of videos) {
    const res = await fetch(`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`);
    if (!res.ok) throw new Error(`Thumbnail ${v.id}: ${res.status}`);
    writeFileSync(join(THUMBS, `${v.id}.jpg`), Buffer.from(await res.arrayBuffer()));
  }
}

/* ───────────────────────── README ───────────────────────── */

const src = (name, theme) => `assets/profile/${name}-${theme}.svg`;

/** GitHub swaps <picture> sources with its own light/dark theme. */
function picture(name, alt, attrs = 'width="100%"') {
  return `<picture><source media="(prefers-color-scheme: dark)" srcset="${src(name, "dark")}"><img ${attrs} src="${src(name, "light")}" alt="${alt}"></picture>`;
}

function readme(snap) {
  const { hero, links, work, sections } = content;
  const linkRow = links
    .map((l) => `<a href="${l.href}">${picture(`link-${l.id}`, l.label, 'height="40"')}</a>`)
    .join("\n");
  const workRows = [0, 2]
    .map((i) =>
      work
        .slice(i, i + 2)
        .map((p) => `<a href="${p.href}">${picture(`work-${p.id}`, `${p.title} — ${p.description}`, 'width="49.4%"')}</a>`)
        .join("\n"),
    )
    .join("\n<br/>\n");
  const videoRow = snap.videos
    .map((v, i) => `<a href="https://www.youtube.com/watch?v=${v.id}">${picture(`video-${i + 1}`, v.title, 'width="32.6%"')}</a>`)
    .join("\n");

  return `<!--
  Generated by scripts/profile/generate.mjs from scripts/profile/content.mjs and a
  daily snapshot of GitHub and YouTube data. Edit those, not this file.
-->

${picture("hero", `${hero.name} — ${hero.headline.join(" ")} ${hero.lead}`)}

<p>
${linkRow}
</p>

<br/>

${picture("label-activity", `${sections.activity.title} — ${sections.activity.detail}`)}

<a href="https://github.com/${content.LOGIN}?tab=repositories">${picture("activity", "Contributions over the last 26 weeks and recently pushed repositories")}</a>

<br/>

${picture("label-work", `${sections.work.title} — ${sections.work.detail}`)}

<p>
${workRows}
</p>

<sub>Also: <a href="https://github.com/davide97g/sharp"><b>Sharp</b></a> (self-hosted Slack, Rust) · <a href="https://github.com/davide97g/pulse-hr"><b>Pulse HR</b></a> (people-first HR) · <a href="https://github.com/davide97g/sonarflow"><b>Sonarflow</b></a> (AI SonarQube fixes) · <a href="https://github.com/davide97g/bitcompass"><b>Bitcompass</b></a> (web architecture toolkit)</sub>

<br/>

${picture("label-channel", `${sections.channel.title} — ${sections.channel.detail}`)}

<p>
${videoRow}
</p>

<details>
<summary><b>More about me</b> &nbsp;<sub>stack · trajectory · how I work</sub></summary>

<br/>

**Now** — Frontend Team Leader at [Bitrock](https://bitrock.it/), leading 5 developers on an enterprise booking system built from independent React micro-frontends.

**How I work** — agent-native by default: Claude Code, Codex and Cursor do the typing; I do the architecture and the review. Developer experience is a product feature.

**Stack** — \`TypeScript\` \`React\` \`Next.js\` \`Angular\` \`Vue\` \`Node.js\` \`Rust\` \`Java\` \`.NET\` \`Python\` \`Postgres\` \`Supabase\` \`Docker\`

**Trajectory**

| | | |
|:--|:--|--:|
| Frontend Team Leader | Bitrock | 2023 — |
| Data Scientist | Infodati | 2022 — 2023 |
| R&D Full-Stack Developer | Namirial | 2021 — 2022 |
| Full-Stack Developer | Reply | 2019 — 2021 |

**Fun fact** — *dacoder* is "davide" + "coder", or, read urban-style, *the coder*.

The long version lives at **[davide97g.github.io/davide97g](https://davide97g.github.io/davide97g/)**, built from the same snapshot.

</details>

<br/>

${picture("footer", `Snapshot taken ${cards.shortDate(snap.generatedAt)}`)}
`;
}

/* ───────────────────────── main ───────────────────────── */

async function main() {
  mkdirSync(OUT, { recursive: true });
  let snap;
  if (process.argv.includes("--offline")) {
    snap = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  } else {
    snap = await fetchSnapshot();
    await fetchThumbs(snap.videos);
    writeFileSync(SNAPSHOT, `${JSON.stringify(snap, null, 2)}\n`);
  }

  const jobs = [];
  for (const t of Object.values(THEMES)) {
    const out = (name) => (svg) => writeFileSync(join(OUT, `${name}-${t.name}.svg`), svg);
    jobs.push(cards.hero(t, content, snap).then(out("hero")));
    jobs.push(cards.activity(t, snap).then(out("activity")));
    for (const [key, s] of Object.entries(content.sections)) jobs.push(cards.label(t, s).then(out(`label-${key}`)));
    for (const l of content.links) jobs.push(cards.pill(t, l).then(out(`link-${l.id}`)));
    for (const p of content.work) jobs.push(cards.project(t, p).then(out(`work-${p.id}`)));
    snap.videos.forEach((v, i) => {
      const thumb = readFileSync(join(THUMBS, `${v.id}.jpg`)).toString("base64");
      jobs.push(cards.video(t, v, thumb, snap, i).then(out(`video-${i + 1}`)));
    });
    jobs.push(cards.footer(t, snap).then(out("footer")));
  }
  await Promise.all(jobs);

  writeFileSync(join(ROOT, "README.md"), readme(snap));
  console.log(`Rendered ${jobs.length} images and README.md from the snapshot of ${snap.generatedAt}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
