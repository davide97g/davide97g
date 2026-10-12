#!/usr/bin/env node
/**
 * Local preview of the profile page: README.md rendered by GitHub's own
 * Markdown API, set inside a mock of the profile layout with the real sidebar
 * and pinned repos, served next to the generated images.
 *
 *   node scripts/profile/preview.mjs   → http://localhost:4173
 */
import { execSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

import { LOGIN } from "./content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = Number(process.env.PORT ?? 4173);
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || execSync("gh auth token", { encoding: "utf8" }).trim();
const gh = (path, init = {}) =>
  fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { authorization: `bearer ${token}`, accept: "application/vnd.github+json", ...init.headers },
  });

async function render() {
  const md = readFileSync(join(ROOT, "README.md"), "utf8");
  const res = await gh("/markdown", {
    method: "POST",
    body: JSON.stringify({ text: md, mode: "gfm", context: `${LOGIN}/${LOGIN}` }),
  });
  if (!res.ok) throw new Error(`markdown: ${res.status} ${await res.text()}`);
  // GitHub points repo-relative images at the default branch; serve the local copies instead.
  return (await res.text()).replace(new RegExp(`https://github\\.com/${LOGIN}/${LOGIN}/(?:raw|blob)/[^/]+/`, "g"), "/");
}

async function profile() {
  const res = await gh("/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: `{ user(login: "${LOGIN}") { name login bio location websiteUrl avatarUrl
        followers { totalCount } following { totalCount } repositories { totalCount } starredRepositories { totalCount }
        socialAccounts(first: 6) { nodes { provider displayName url } }
        pinnedItems(first: 6) { nodes { ... on Repository { name description stargazerCount forkCount primaryLanguage { name color } } } } } }`,
    }),
  });
  return (await res.json()).data.user;
}

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(readme, u) {
  const social = u.socialAccounts.nodes
    .map((s) => `<li><span class="ico">${s.provider === "LINKEDIN" ? "in" : s.provider === "YOUTUBE" ? "▶" : "↗"}</span><a href="${s.url}">${esc(s.displayName)}</a></li>`)
    .join("");
  const pinned = u.pinnedItems.nodes
    .map(
      (r) => `<div class="pin"><div class="pin-h"><span class="repo-ico">▣</span><a href="#">${esc(r.name)}</a><span class="pub">Public</span></div>
<p>${esc(r.description ?? "")}</p>
<div class="pin-m">${r.primaryLanguage ? `<span><i style="background:${r.primaryLanguage.color}"></i>${esc(r.primaryLanguage.name)}</span>` : ""}${r.stargazerCount ? `<span>☆ ${r.stargazerCount}</span>` : ""}</div></div>`,
    )
    .join("");
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profile preview</title>
<link id="md-light" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-light.min.css">
<link id="md-dark" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown-dark.min.css">
<style>
:root{--bg:#fff;--fg:#1f2328;--muted:#59636e;--line:#d1d9e0;--head:#f6f8fa;--link:#0969da;--btn:#f6f8fa}
[data-theme=dark]{--bg:#0d1117;--fg:#f0f6fc;--muted:#9198a1;--line:#3d444d;--head:#010409;--link:#4493f8;--btn:#212830}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif}
a{color:var(--link);text-decoration:none}
.top{background:var(--head);border-bottom:1px solid var(--line);padding:16px 32px 0}
.top-row{display:flex;align-items:center;gap:16px;font-weight:600}
.top-row svg{width:32px;height:32px;fill:var(--fg)}
.tabs{display:flex;gap:8px;margin-top:16px;overflow-x:auto}
.tabs span{padding:8px 10px;border-bottom:2px solid transparent;white-space:nowrap}
.tabs span.on{border-color:#fd8c73;font-weight:600}
.tabs b{background:var(--btn);border-radius:99px;padding:0 7px;font-size:12px;margin-left:4px;font-weight:500}
.toggle{margin-left:auto;font:inherit;font-size:12px;background:var(--btn);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:5px 12px;cursor:pointer}
.wrap{max-width:1280px;margin:0 auto;padding:24px 32px;display:grid;grid-template-columns:296px 1fr;gap:24px}
.side img.av{width:296px;height:296px;border-radius:50%;border:1px solid var(--line)}
.side h1{margin:16px 0 0;font-size:24px;line-height:1.25}
.side .login{font-size:20px;color:var(--muted);font-weight:300}
.side .bio{margin:16px 0;white-space:pre-line;font-size:16px}
.edit{display:block;width:100%;text-align:center;background:var(--btn);border:1px solid var(--line);border-radius:6px;padding:5px;font-weight:500;color:var(--fg)}
.side .ff{margin:16px 0;color:var(--muted)}.side .ff b{color:var(--fg)}
.side ul{list-style:none;padding:0;margin:0}.side li{display:flex;gap:8px;margin:6px 0}
.ico{width:16px;color:var(--muted);text-align:center;font-size:12px}
.readme{border:1px solid var(--line);border-radius:6px;padding:24px}
.readme .path{font:12px ui-monospace,SFMono-Regular,Menlo,monospace;margin-bottom:16px}
.markdown-body{background:transparent!important;font-size:16px}
.pins{margin-top:24px}.pins h2{font-size:16px;font-weight:400;margin:0 0 8px}
.pin-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.pin{border:1px solid var(--line);border-radius:6px;padding:16px;font-size:12px;color:var(--muted)}
.pin-h{display:flex;gap:8px;align-items:center;font-size:14px;font-weight:600}
.pub{border:1px solid var(--line);border-radius:99px;padding:0 7px;font-size:12px;font-weight:500;color:var(--muted)}
.repo-ico{color:var(--muted);font-weight:400}
.pin p{margin:8px 0 12px}.pin-m{display:flex;gap:16px}.pin-m i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:4px;vertical-align:-1px}
@media (max-width:900px){.wrap{grid-template-columns:1fr;padding:16px}.side{display:flex;gap:16px;flex-wrap:wrap}.side img.av{width:88px;height:88px}.pin-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="top">
<div class="top-row"><svg viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>${esc(u.login)}
<button class="toggle" id="toggle">Switch to light</button></div>
<nav class="tabs"><span class="on">Overview</span><span>Repositories<b>${u.repositories.totalCount}</b></span><span>Projects</span><span>Packages</span><span>Stars<b>${u.starredRepositories.totalCount}</b></span></nav>
</header>
<div class="wrap">
<aside class="side">
<img class="av" src="${u.avatarUrl}" alt="">
<div><h1>${esc(u.name)}</h1><div class="login">${esc(u.login)}</div>
<div class="bio">${esc(u.bio)}</div>
<span class="edit">Edit profile</span>
<div class="ff">👥 <b>${u.followers.totalCount}</b> followers · <b>${u.following.totalCount}</b> following</div>
<ul><li><span class="ico">⌖</span>${esc(u.location)}</li><li><span class="ico">↗</span><a href="${u.websiteUrl}">${esc(u.websiteUrl)}</a></li>${social}</ul></div>
</aside>
<main>
<div class="readme"><div class="path">${esc(u.login)} / README<span style="opacity:.6">.md</span></div>
<article class="markdown-body">${readme}</article></div>
<section class="pins"><h2>Pinned</h2><div class="pin-grid">${pinned}</div></section>
</main>
</div>
<script>
// GitHub picks the <picture> source from its own theme; emulate that by rewriting the media query.
const root = document.documentElement, btn = document.getElementById("toggle");
const sources = [...document.querySelectorAll('source[media*="prefers-color-scheme"]')];
function apply(theme) {
  root.dataset.theme = theme;
  document.getElementById("md-light").disabled = theme === "dark";
  document.getElementById("md-dark").disabled = theme !== "dark";
  sources.forEach((s) => (s.media = theme === "dark" ? "all" : "not all"));
  btn.textContent = theme === "dark" ? "Switch to light" : "Switch to dark";
  try { localStorage.setItem("preview-theme", theme); } catch {}
}
let saved; try { saved = localStorage.getItem("preview-theme"); } catch {}
apply(new URLSearchParams(location.search).get("theme") || saved || "dark");
btn.onclick = () => apply(root.dataset.theme === "dark" ? "light" : "dark");
</script>
</body>
</html>`;
}

const TYPES = { ".html": "text/html", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".json": "application/json", ".png": "image/png" };

async function main() {
  const [readme, user] = await Promise.all([render(), profile()]);
  const dir = join(ROOT, ".preview");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(readme, user));

  createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = url === "/" ? join(dir, "index.html") : join(ROOT, normalize(url).replace(/^(\.\.[/\\])+/, ""));
    if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-store" });
    createReadStream(file).pipe(res);
  }).listen(PORT, () => console.log(`Preview on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
