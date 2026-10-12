/**
 * One function per image in the README. Each takes the theme tokens (and the
 * snapshot where it needs data) and returns a finished SVG document.
 */
import { card, chromeOrb, document, icon, mark, ORB_CSS, typesetter } from "./svg.mjs";

const fmt = new Intl.NumberFormat("en-US");

export function shortDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function ago(iso, now) {
  const days = Math.floor((Date.parse(now) - Date.parse(iso)) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days}d ago`;
  if (days < 60) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

/** Body copy sits between the foreground and the muted grey. */
const body = (t) => (t.name === "light" ? "#3f3f3f" : "#cfcfcf");

/* ───────────────────────── hero ───────────────────────── */

export async function hero(t, content, snap) {
  const W = 880;
  const H = 340;
  const T = typesetter();
  const parts = [];
  const { hero: h } = content;

  parts.push(`<rect width="${W}" height="${H}" rx="28" fill="${t.slab}"/>`);

  // Identity card.
  parts.push(card({ x: 10, y: 10, w: 556, h: 320, fill: t.card, stroke: t.cardLine }));
  parts.push(`<g class="rise" style="--i:0">${mark({ x: 34, y: 34, size: 38, bg: t.primary, fg: t.primaryFg, id: "hm" })}</g>`);
  parts.push(
    `<g class="rise" style="--i:1">${T.text(h.name, { x: 84, y: 50, size: 15, weight: 600, fill: t.fg })}${T.text(h.meta, { x: 84, y: 68, size: 12.5, fill: t.muted })}</g>`,
  );

  // Status pill, top right, with a live dot that keeps breathing.
  const pillText = T.width(h.status, { size: 12, weight: 500 });
  const pillW = pillText + 36;
  const pillX = 542 - pillW;
  parts.push(`<g class="rise" style="--i:2">
<rect x="${pillX}" y="38" width="${pillW}" height="28" rx="14" fill="${t.chip}" stroke="${t.chipLine}"/>
<circle class="pulse" cx="${pillX + 15}" cy="52" r="3.5" fill="${t.live}"/>
<circle cx="${pillX + 15}" cy="52" r="3.5" fill="${t.live}"/>
${T.text(h.status, { x: pillX + 26, y: 56, size: 12, weight: 500, fill: t.fg })}
</g>`);

  // Headline: first line in ink, second in grey, a block caret after it.
  const [l1, l2] = h.headline;
  const hSize = 42;
  const track = -1.4;
  const l2w = T.width(l2, { size: hSize, weight: 600, tracking: track });
  parts.push(`<g class="rise" style="--i:3">${T.text(l1, { x: 32, y: 148, size: hSize, weight: 600, tracking: track, fill: t.fg })}</g>`);
  parts.push(`<g class="rise" style="--i:4">${T.text(l2, { x: 32, y: 196, size: hSize, weight: 600, tracking: track, fill: t.subtle })}
<rect class="caret" x="${32 + l2w + 6}" y="166" width="16" height="34" rx="2" fill="${t.fg}"/></g>`);

  const lead = T.wrap(h.lead, { size: 14, max: 490, lines: 2 });
  parts.push(
    `<g class="rise" style="--i:5">${lead.map((line, i) => T.text(line, { x: 34, y: 236 + i * 21, size: 14, fill: t.muted })).join("")}</g>`,
  );

  let cx = 34;
  const chips = h.chips.map((label, i) => {
    const w = T.width(label, { size: 11.5, mono: true }) + 22;
    const g = `<g class="rise" style="--i:${6 + i}"><rect x="${cx}" y="282" width="${w}" height="26" rx="8" fill="${t.chip}" stroke="${t.chipLine}"/>${T.text(label, { x: cx + 11, y: 299, size: 11.5, mono: true, fill: t.fg })}</g>`;
    cx += w + 8;
    return g;
  });
  parts.push(...chips);

  // The black "now" card, with the orb and the rotating focus.
  const bx = 576;
  parts.push(card({ x: bx, y: 10, w: 294, h: 320, fill: t.ink, stroke: t.inkLine }));
  parts.push(chromeOrb({ cx: bx + 147, cy: 122, r: 50, id: "orb", floor: 196 }));
  parts.push(
    `<g class="rise" style="--i:2">${icon("arrowUpRight", { x: bx + 22, y: 30, size: 15, color: t.inkFg })}${T.text("Now", { x: bx + 44, y: 43, size: 14, weight: 600, fill: t.inkFg })}${T.text(shortDate(snap.generatedAt).replace(/ \d{4}$/, ""), { x: bx + 272, y: 43, size: 11.5, mono: true, fill: t.inkMuted, anchor: "end" })}</g>`,
  );

  const n = h.now.length;
  const slot = 100 / n;
  const css = [];
  h.now.forEach((item, i) => {
    const p0 = i * slot;
    const p1 = p0 + 2.5;
    const p3 = p0 + slot;
    const p2 = p3 - 2.5;
    const pct = (v) => `${+v.toFixed(3)}%`;
    css.push(
      `.now${i}{animation:now${i} ${n * 4}s cubic-bezier(.16,1,.3,1) infinite}`,
      `@keyframes now${i}{${p0 > 0 ? `0%,${pct(p0)}` : "0%"}{opacity:0;transform:translateY(10px)}${pct(p1)},${pct(p2)}{opacity:1;transform:none}${pct(p3)},100%{opacity:0;transform:translateY(-10px)}}`,
      `.bar${i}{transform-box:fill-box;transform-origin:left;animation:bar${i} ${n * 4}s linear infinite}`,
      `@keyframes bar${i}{${p0 > 0 ? `0%,${pct(p0)}` : "0%"}{transform:scaleX(0)}${pct(p3)},100%{transform:scaleX(1)}}`,
    );
    parts.push(`<g class="now${i}" opacity="${i === 0 ? 1 : 0}">
${T.text(item.label.toUpperCase(), { x: bx + 22, y: 238, size: 10.5, mono: true, tracking: 1.4, fill: t.inkMuted })}
${T.text(item.title, { x: bx + 21, y: 272, size: 30, weight: 600, tracking: -0.9, fill: t.inkFg })}
${T.text(item.detail, { x: bx + 22, y: 294, size: 13, fill: t.inkMuted })}
</g>`);
    const segW = (250 - (n - 1) * 6) / n;
    const sx = bx + 22 + i * (segW + 6);
    parts.push(
      `<rect x="${sx}" y="310" width="${segW}" height="3" rx="1.5" fill="#2b2b2b"/><rect class="bar${i}" x="${sx}" y="310" width="${segW}" height="3" rx="1.5" fill="${t.inkFg}" ${i === 0 ? "" : 'style="transform:scaleX(0)"'}/>`,
    );
  });

  return document({
    width: W,
    height: H,
    title: `${h.name} — ${h.headline.join(" ")} ${h.lead}`,
    body: parts.join("\n"),
    css: ORB_CSS + css.join("\n"),
    fonts: T.fonts,
  });
}

/* ───────────────────────── section label ───────────────────────── */

export async function label(t, { index, title, detail }) {
  const W = 880;
  const H = 64;
  const T = typesetter();
  const tw = T.width(title, { size: 22, weight: 600, tracking: -0.5 });
  const dw = T.width(detail, { size: 13 });
  const lineX = 44 + tw + 12 + dw + 20;
  const body = `
<g class="pop"><rect x="0" y="18" width="30" height="30" rx="8" fill="${t.primary}"/>${T.text(index, { x: 15, y: 37.5, size: 11.5, weight: 500, mono: true, fill: t.primaryFg, anchor: "middle" })}</g>
<g class="rise" style="--i:1">${T.text(title, { x: 44, y: 41, size: 22, weight: 600, tracking: -0.5, fill: t.fg })}</g>
<g class="rise" style="--i:2">${T.text(detail, { x: 44 + tw + 12, y: 40, size: 13, fill: t.muted })}</g>
<path class="draw" style="--len:${W - lineX}" d="M${lineX} 34.5H${W}" stroke="${t.line}" stroke-width="1"/>
<circle class="pop" style="--i:6" cx="${W - 3}" cy="34.5" r="3" fill="${t.subtle}"/>`;
  return document({ width: W, height: H, title: `${title} — ${detail}`, body, fonts: T.fonts });
}

/* ───────────────────────── activity ───────────────────────── */

function levels(counts) {
  const nonzero = counts.filter(Boolean).sort((a, b) => a - b);
  const q = (p) => nonzero[Math.floor(p * (nonzero.length - 1))] ?? 1;
  const cuts = [q(0.25), q(0.5), q(0.75)];
  return (c) => (c === 0 ? 0 : c <= cuts[0] ? 1 : c <= cuts[1] ? 2 : c <= cuts[2] ? 3 : 4);
}

export async function activity(t, snap) {
  const W = 880;
  const H = 286;
  const T = typesetter();
  const parts = [`<rect width="${W}" height="${H}" rx="28" fill="${t.slab}"/>`];

  // Contributions: the last 26 full columns of the calendar, chunky enough to read on a phone.
  const WEEKS = 26;
  const weeks = snap.contributions.weeks.slice(-WEEKS);
  const all = weeks.flat();
  const total = all.reduce((s, d) => s + d.count, 0);
  const level = levels(all.map((d) => d.count));

  parts.push(card({ x: 10, y: 10, w: 528, h: 266, fill: t.card, stroke: t.cardLine }));
  parts.push(
    `<g class="rise" style="--i:0">${T.text("Contributions", { x: 34, y: 46, size: 17, weight: 600, tracking: -0.2, fill: t.fg })}${T.text("Last 26 weeks, day by day", { x: 34, y: 66, size: 12.5, fill: t.muted })}</g>`,
    `<g class="rise" style="--i:1">${T.text(fmt.format(total), { x: 514, y: 52, size: 30, weight: 600, tracking: -1, fill: t.fg, anchor: "end" })}${T.text("contributions", { x: 514, y: 69, size: 11.5, fill: t.muted, anchor: "end" })}</g>`,
  );

  const pitch = 18.4;
  const size = 14;
  const gx = 34;
  const gy = 90;
  const today = snap.generatedAt.slice(0, 10);
  let lastMonth = "";
  weeks.forEach((week, col) => {
    const month = week[0]?.date.slice(5, 7);
    if (month && month !== lastMonth && col < WEEKS - 1) {
      if (lastMonth) {
        const name = new Date(`${week[0].date}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
        parts.push(T.text(name, { x: gx + col * pitch, y: gy + 7 * pitch + 14, size: 10.5, mono: true, fill: t.subtle, cls: "fade", style: `--i:${4 + col / 4}` }));
      }
      lastMonth = month;
    }
    week.forEach((day) => {
      const row = new Date(`${day.date}T00:00:00Z`).getUTCDay();
      const x = +(gx + col * pitch).toFixed(1);
      const y = +(gy + row * pitch).toFixed(1);
      const delay = Math.round(200 + col * 22 + row * 14);
      parts.push(
        `<rect class="cell" style="animation-delay:${delay}ms" x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="${t.heat[level(day.count)]}"><title>${day.count} on ${day.date}</title></rect>`,
      );
      if (day.date === today) {
        parts.push(
          `<rect class="ring" x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="none" stroke="${t.fg}" stroke-width="1.5"/><rect x="${x - 2}" y="${y - 2}" width="${size + 4}" height="${size + 4}" rx="5.5" fill="none" stroke="${t.fg}" stroke-width="1.2"/>`,
        );
      }
    });
  });

  // Legend and the yearly total.
  const ly = 258;
  parts.push(`<g class="fade" style="--i:8">${T.text("Less", { x: 34, y: ly, size: 10.5, mono: true, fill: t.subtle })}`);
  t.heat.forEach((c, i) => parts.push(`<rect x="${66 + i * 14}" y="${ly - 9}" width="10" height="10" rx="3" fill="${c}"/>`));
  parts.push(`${T.text("More", { x: 66 + 5 * 14 + 4, y: ly, size: 10.5, mono: true, fill: t.subtle })}`);
  parts.push(
    `${T.text(`${fmt.format(snap.contributions.total)} in the last year · since ${snap.user.createdAt.slice(0, 4)}`, { x: 514, y: ly, size: 10.5, mono: true, fill: t.subtle, anchor: "end" })}</g>`,
  );

  // Recently pushed.
  const rx = 548;
  parts.push(card({ x: rx, y: 10, w: 322, h: 266, fill: t.card, stroke: t.cardLine }));
  parts.push(
    `<g class="rise" style="--i:1">${T.text("Recently pushed", { x: rx + 24, y: 46, size: 17, weight: 600, tracking: -0.2, fill: t.fg })}${T.text("Public repos, newest first", { x: rx + 24, y: 66, size: 12.5, fill: t.muted })}</g>`,
    `<g class="pop" style="--i:2"><rect x="${rx + 266}" y="28" width="32" height="32" rx="9" fill="${t.primary}"/>${icon("gitBranch", { x: rx + 274, y: 36, size: 16, color: t.primaryFg })}</g>`,
  );
  const shades = [t.fg, t.muted, t.subtle, t.line];
  snap.recent.slice(0, 4).forEach((repo, i) => {
    const y = 88 + i * 46;
    const when = ago(repo.pushedAt, snap.generatedAt);
    const chipW = T.width(when, { size: 10.5, mono: true }) + 16;
    const [name] = T.wrap(repo.name, { size: 14, weight: 500, max: 296 - 24 - chipW - 30, lines: 1 });
    const meta = [repo.language, repo.stars ? `★ ${repo.stars}` : null].filter(Boolean).join(" · ") || "—";
    parts.push(`<g class="rise" style="--i:${3 + i}">
${i ? `<path d="M${rx + 24} ${y - 6}H${rx + 298}" stroke="${t.line}"/>` : ""}
<rect x="${rx + 24}" y="${y + 3}" width="3" height="30" rx="1.5" fill="${shades[i]}"/>
${T.text(name, { x: rx + 38, y: y + 17, size: 14, weight: 500, fill: t.fg })}
${T.text(meta, { x: rx + 38, y: y + 33, size: 11.5, fill: t.muted })}
<rect x="${rx + 298 - chipW}" y="${y + 6}" width="${chipW}" height="22" rx="11" fill="${t.chip}" stroke="${t.chipLine}"/>
${T.text(when, { x: rx + 298 - chipW / 2, y: y + 21, size: 10.5, mono: true, fill: t.fg, anchor: "middle" })}
</g>`);
  });

  const css = `.cell{transform-box:fill-box;transform-origin:center;animation:cell 650ms cubic-bezier(.34,1.56,.64,1) both}
@keyframes cell{from{opacity:0;transform:scale(.3)}}`;
  return document({
    width: W,
    height: H,
    title: `${fmt.format(total)} contributions in the last 26 weeks, ${fmt.format(snap.contributions.total)} in the last year. Recently pushed: ${snap.recent
      .slice(0, 4)
      .map((r) => r.name)
      .join(", ")}.`,
    body: parts.join("\n"),
    css,
    fonts: T.fonts,
  });
}

/* ───────────────────────── link pill ───────────────────────── */

export async function pill(t, link) {
  const T = typesetter();
  const H = 40;
  const lw = T.width(link.label, { size: 13.5, weight: 500 });
  const W = Math.ceil(16 + 16 + 9 + lw + 10 + 12 + 16) + 2;
  const fill = link.primary ? t.primary : t.card;
  const fg = link.primary ? t.primaryFg : t.fg;
  const sub = link.primary ? (t.name === "light" ? "#8a8a8a" : "#6b6b6b") : t.subtle;
  const body = `
<clipPath id="pc"><rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12"/></clipPath>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${fill}" ${link.primary ? "" : `stroke="${t.cardLine}"`}/>
<g clip-path="url(#pc)"><polygon class="shine" style="--travel:${W + 90}px" points="-70,${H} -50,0 -10,0 -30,${H}" fill="url(#ps)"/></g>
<linearGradient id="ps" x1="0" x2="1"><stop offset="0" stop-color="${fg}" stop-opacity="0"/><stop offset=".5" stop-color="${fg}" stop-opacity=".22"/><stop offset="1" stop-color="${fg}" stop-opacity="0"/></linearGradient>
${icon(link.icon, { x: 17, y: 12, size: 16, color: fg, width: 1.9 })}
${T.text(link.label, { x: 42, y: 25, size: 13.5, weight: 500, fill: fg })}
<g class="nudge">${icon("arrowUpRight", { x: 42 + lw + 8, y: 14, size: 12, color: sub, width: 2.2 })}</g>`;
  const css = `.nudge{animation:nudge 5s cubic-bezier(.16,1,.3,1) 2s infinite}
@keyframes nudge{0%,12%,100%{transform:none}6%{transform:translate(2px,-2px)}}
.shine{animation-delay:${link.primary ? 1.2 : 3}s}`;
  return document({ width: W, height: H, title: link.label, body, css, fonts: T.fonts });
}

/* ───────────────────────── work card ───────────────────────── */

const STATUS_DOT = (t, status) => (status === "Live" ? t.live : status === "Open source" ? t.fg : t.subtle);

export async function project(t, p) {
  const W = 434;
  const H = 214;
  const T = typesetter();
  const parts = [card({ x: 1, y: 1, w: W - 2, h: H - 2, r: 20, fill: t.card, stroke: t.cardLine })];

  parts.push(
    `<g class="pop"><rect x="22" y="22" width="36" height="36" rx="10" fill="${t.primary}"/>${T.text(p.title[0], { x: 40, y: 46, size: 17, weight: 600, fill: t.primaryFg, anchor: "middle" })}</g>`,
    `<g class="rise" style="--i:1">${T.text(p.title, { x: 70, y: 37, size: 16, weight: 600, tracking: -0.2, fill: t.fg })}
<circle cx="74" cy="51" r="3" fill="${STATUS_DOT(t, p.status)}"/>${p.status === "Live" ? `<circle class="pulse" cx="74" cy="51" r="3" fill="${t.live}"/>` : ""}
${T.text(`${p.status} · ${p.year}`, { x: 82, y: 55, size: 12, fill: t.muted })}</g>`,
    `<g class="rise" style="--i:2"><rect x="${W - 54}" y="22" width="32" height="32" rx="16" fill="${t.chip}" stroke="${t.chipLine}"/><g class="nudge">${icon("arrowUpRight", { x: W - 46, y: 30, size: 16, color: t.fg })}</g></g>`,
  );

  const lines = T.wrap(p.description, { size: 13.5, max: 388, lines: 3 });
  parts.push(`<g class="rise" style="--i:3">${lines.map((l, i) => T.text(l, { x: 22, y: 92 + i * 20, size: 13.5, fill: body(t) })).join("")}</g>`);

  let x = 22;
  p.tags.forEach((tag, i) => {
    const w = T.width(tag, { size: 11, mono: true }) + 18;
    parts.push(
      `<g class="rise" style="--i:${4 + i}"><rect x="${x}" y="168" width="${w}" height="24" rx="7" fill="${t.chip}" stroke="${t.chipLine}"/>${T.text(tag, { x: x + 9, y: 184, size: 11, mono: true, fill: t.muted })}</g>`,
    );
    x += w + 6;
  });

  const css = `.nudge{animation:nudge 6s cubic-bezier(.16,1,.3,1) 2.5s infinite}
@keyframes nudge{0%,10%,100%{transform:none}5%{transform:translate(2px,-2px)}}`;
  return document({ width: W, height: H, title: `${p.title} — ${p.description}`, body: parts.join("\n"), css, fonts: T.fonts });
}

/* ───────────────────────── video card ───────────────────────── */

export async function video(t, v, thumb, snap, i) {
  const W = 288;
  const H = 262;
  const T = typesetter();
  const tw = 264;
  const th = 148.5;
  const fresh = i === 0 && Date.parse(snap.generatedAt) - Date.parse(v.published) < 7 * 86_400_000;
  const parts = [card({ x: 1, y: 1, w: W - 2, h: H - 2, r: 20, fill: t.card, stroke: t.cardLine })];
  parts.push(`<defs>
<clipPath id="th"><rect x="12" y="12" width="${tw}" height="${th}" rx="13"/></clipPath>
<filter id="mono"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="1.08" intercept="-0.03"/><feFuncG type="linear" slope="1.08" intercept="-0.03"/><feFuncB type="linear" slope="1.08" intercept="-0.03"/></feComponentTransfer></filter>
<linearGradient id="veil" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
</defs>
<g clip-path="url(#th)" class="fade">
<!-- A README image never sees the pointer, so instead of colour on hover the cards take turns developing into colour. -->
<g class="zoom">
<image id="still" x="12" y="12" width="${tw}" height="${th}" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,${thumb}"/>
<use class="develop" href="#still" filter="url(#mono)"/>
</g>
<rect x="12" y="12" width="${tw}" height="${th}" fill="url(#veil)"/>
</g>
<g class="pop" style="--i:3">
<circle class="ring" cx="38" cy="${12 + th - 26}" r="15" fill="#fff"/>
<circle cx="38" cy="${12 + th - 26}" r="15" fill="#fff"/>
${icon("play", { x: 31, y: 12 + th - 33, size: 14, color: "#0a0a0a", fill: "#0a0a0a", width: 1 })}
</g>`);
  if (fresh) {
    parts.push(
      `<g class="pop" style="--i:4"><rect x="${12 + tw - 50}" y="22" width="40" height="22" rx="11" fill="#fff"/>${T.text("NEW", { x: 12 + tw - 30, y: 37, size: 10, weight: 500, mono: true, tracking: 1, fill: "#0a0a0a", anchor: "middle" })}</g>`,
    );
  }
  const lines = T.wrap(v.title, { size: 13.5, weight: 500, max: tw - 4, lines: 2 });
  parts.push(
    `<g class="rise" style="--i:2">${lines.map((l, k) => T.text(l, { x: 14, y: 186 + k * 19, size: 13.5, weight: 500, fill: t.fg })).join("")}</g>`,
    `<g class="rise" style="--i:3">${T.text(`${fmt.format(v.views)} views · ${ago(v.published, snap.generatedAt)}`, { x: 14, y: 242, size: 11, mono: true, fill: t.muted })}</g>`,
  );
  const css = `.zoom{transform-box:fill-box;transform-origin:center;animation:zoom 14s ease-in-out ${i * 1.5}s infinite alternate}
@keyframes zoom{to{transform:scale(1.06)}}
.develop{animation:develop 9s ease-in-out ${1.2 + i * 3}s infinite}
@keyframes develop{0%,100%{opacity:1}9%,27%{opacity:0}36%{opacity:1}}`;
  return document({ width: W, height: H, title: v.title, body: parts.join("\n"), css, fonts: T.fonts });
}

/* ───────────────────────── footer ───────────────────────── */

export async function footer(t, snap) {
  const W = 880;
  const H = 60;
  const T = typesetter();
  const body = `
<path class="draw" style="--len:${W}" d="M0 10.5H${W}" stroke="${t.line}"/>
<g class="rise" style="--i:1">${mark({ x: 0, y: 26, size: 24, bg: t.primary, fg: t.primaryFg, id: "fm" })}
${T.text("Davide Ghiotto", { x: 34, y: 43, size: 13, weight: 600, fill: t.fg })}
${T.text(`· built in public, one commit at a time`, { x: 34 + T.width("Davide Ghiotto", { size: 13, weight: 600 }) + 6, y: 43, size: 13, fill: t.muted })}</g>
<g class="rise" style="--i:2">${T.text(`snapshot ${shortDate(snap.generatedAt)} · github graphql + youtube rss`, { x: W, y: 43, size: 10.5, mono: true, fill: t.subtle, anchor: "end" })}</g>`;
  return document({ width: W, height: H, title: `Snapshot taken ${shortDate(snap.generatedAt)}`, body, fonts: T.fonts });
}
