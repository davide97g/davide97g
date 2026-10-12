/**
 * SVG primitives for the profile README: theme tokens, text measured with the
 * real Geist metrics (so chips and wrapping fit), and a document wrapper that
 * embeds a per-file subset of the fonts it actually uses.
 *
 * Images in a README are rendered through <img>, so nothing outside the file
 * loads: fonts travel as data URIs, motion is plain CSS keyframes, and every
 * animated element has a resting state that reads fine under reduced motion.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as fontkit from "fontkit";
import subsetFont from "subset-font";

// The site depends on the geist package already; its font files are the source here too.
const geistDir = join(dirname(fileURLToPath(import.meta.url)), "../../node_modules/geist/dist/fonts");

const FACES = {
  sans400: { family: "Geist", weight: 400, file: "geist-sans/Geist-Regular.ttf" },
  sans500: { family: "Geist", weight: 500, file: "geist-sans/Geist-Medium.ttf" },
  sans600: { family: "Geist", weight: 600, file: "geist-sans/Geist-SemiBold.ttf" },
  mono400: { family: "Geist Mono", weight: 400, file: "geist-mono/GeistMono-Regular.ttf" },
  mono500: { family: "Geist Mono", weight: 500, file: "geist-mono/GeistMono-Medium.ttf" },
};

const loaded = {};
function face(name) {
  if (!loaded[name]) {
    const buffer = readFileSync(join(geistDir, FACES[name].file));
    loaded[name] = { buffer, font: fontkit.create(buffer) };
  }
  return loaded[name];
}

/** Advance width of a run of text, kerning included, in px. */
export function measure(str, name, size, tracking = 0) {
  const { font } = face(name);
  const run = font.layout(str);
  return (run.advanceWidth / font.unitsPerEm) * size + tracking * [...str].length;
}

/** Greedy word wrap; the last allowed line gets an ellipsis if text is left over. */
export function wrap(str, name, size, maxWidth, maxLines = Infinity) {
  const words = str.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (measure(next, name, size) <= maxWidth || !line) {
      line = next;
      continue;
    }
    lines.push(line);
    line = words[i];
    if (lines.length === maxLines) {
      line = "";
      let last = lines.pop();
      while (measure(`${last}…`, name, size) > maxWidth) last = last.replace(/\s*\S+$/, "");
      lines.push(`${last}…`);
      return lines;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Monocromo, the autocratico palette: neutrals only. Colour is kept for state
 * (a live dot), never for decoration.
 */
export const THEMES = {
  light: {
    name: "light",
    slab: "#e9e9e9",
    card: "#fdfdfd",
    cardLine: "#e3e3e3",
    fg: "#0a0a0a",
    muted: "#737373",
    subtle: "#a3a3a3",
    line: "#e8e8e8",
    chip: "#f2f2f2",
    chipLine: "#e3e3e3",
    primary: "#111111",
    primaryFg: "#fafafa",
    ink: "#0b0b0b",
    inkLine: "#0b0b0b",
    inkFg: "#fafafa",
    inkMuted: "#9b9b9b",
    inkChip: "#1f1f1f",
    heat: ["#ececec", "#cfcfcf", "#a3a3a3", "#5f5f5f", "#141414"],
    live: "#16a34a",
    shadow: 0.07,
  },
  dark: {
    name: "dark",
    slab: "#0b0b0b",
    card: "#161616",
    cardLine: "#262626",
    fg: "#fafafa",
    muted: "#a1a1a1",
    subtle: "#6b6b6b",
    line: "#262626",
    chip: "#202020",
    chipLine: "#2e2e2e",
    primary: "#ebebeb",
    primaryFg: "#111111",
    ink: "#000000",
    inkLine: "#262626",
    inkFg: "#fafafa",
    inkMuted: "#8f8f8f",
    inkChip: "#1a1a1a",
    heat: ["#1f1f1f", "#3a3a3a", "#666666", "#a6a6a6", "#f2f2f2"],
    live: "#22c55e",
    shadow: 0,
  },
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/** Motion shared by every image: one rhythm, entrances ease out in ~600 ms. */
const BASE_CSS = `
.rise{animation:rise 700ms ${EASE} both;animation-delay:calc(var(--i,0)*70ms)}
@keyframes rise{from{opacity:0;transform:translateY(10px)}}
.fade{animation:fade 900ms ease-out both;animation-delay:calc(var(--i,0)*70ms)}
@keyframes fade{from{opacity:0}}
.pop{transform-box:fill-box;transform-origin:center;animation:pop 520ms ${SPRING} both;animation-delay:calc(var(--i,0)*70ms)}
@keyframes pop{from{opacity:0;transform:scale(.4)}}
.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2.4s ease-out infinite}
@keyframes pulse{0%{opacity:.55;transform:scale(1)}70%,100%{opacity:0;transform:scale(3)}}
.ring{transform-box:fill-box;transform-origin:center;animation:ring 2.8s ease-out infinite}
@keyframes ring{0%{opacity:.5;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.55)}}
.caret{animation:caret 1.1s steps(2,start) infinite}
@keyframes caret{to{visibility:hidden}}
.draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:draw 1.6s ${EASE} 300ms forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.shine{animation:shine 7s ${EASE} 1.2s infinite}
@keyframes shine{0%{transform:none}18%,100%{transform:translateX(var(--travel))}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.draw{stroke-dashoffset:0}}
`;

/**
 * Wraps a body in an <svg> document. `fonts` maps face names to the text drawn
 * with them; each face is subset to exactly those characters and inlined.
 */
export async function document({ width, height, title, body, css = "", fonts }) {
  const faces = [];
  for (const [name, texts] of Object.entries(fonts)) {
    const chars = [...new Set([...texts.join("")])].join("") || " ";
    const woff2 = await subsetFont(face(name).buffer, `${chars} `, { targetFormat: "woff2" });
    const { family, weight } = FACES[name];
    faces.push(
      `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${woff2.toString("base64")}) format("woff2")}`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>
${faces.join("\n")}
text{font-family:"Geist",ui-sans-serif,system-ui,sans-serif;font-kerning:normal}
.m{font-family:"Geist Mono",ui-monospace,monospace}
${BASE_CSS}
${css}
</style>
${body}
</svg>
`;
}

/**
 * Collects the text an image draws, per face, while it is being built, and
 * returns <text> markup. `t.text(...)` is the only way glyphs get on screen.
 */
export function typesetter() {
  const fonts = {};
  const face = (weight, mono) => `${mono ? "mono" : "sans"}${weight}`;
  return {
    fonts,
    text(str, { x, y, size, weight = 400, mono = false, fill, anchor, tracking, cls, style, extra = "" }) {
      const name = face(weight, mono);
      (fonts[name] ??= []).push(str);
      const attrs = [
        `x="${x}"`,
        `y="${y}"`,
        `font-size="${size}"`,
        `font-weight="${weight}"`,
        fill && `fill="${fill}"`,
        anchor && `text-anchor="${anchor}"`,
        tracking && `letter-spacing="${tracking}"`,
        `class="${[mono && "m", cls].filter(Boolean).join(" ")}"`,
        style && `style="${style}"`,
        extra,
      ];
      return `<text ${attrs.filter(Boolean).join(" ")}>${esc(str)}</text>`;
    },
    width(str, { size, weight = 400, mono = false, tracking = 0 }) {
      return measure(str, face(weight, mono), size, tracking);
    },
    wrap(str, { size, weight = 400, mono = false, max, lines }) {
      return wrap(str, face(weight, mono), size, max, lines);
    },
  };
}

/** Lucide icons (24px grid, stroke), drawn at any size. */
const ICONS = {
  arrowUpRight: ["M7 7h10v10", "M7 17 17 7"],
  globe: ["M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", "M2 12h20", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20"],
  youtube: [
    "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
    "m10 15 5-3-5-3z",
  ],
  linkedin: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z", "M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"],
  instagram: ["M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z", "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", "M17.5 6.5h.01"],
  mail: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"],
  layers: [
    "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",
    "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",
    "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",
  ],
  pin: ["M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", "M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6"],
  calendar: ["M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M16 2v4", "M8 2v4", "M3 10h18"],
  activity: ["M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"],
  play: ["M6 4.5a1.5 1.5 0 0 1 2.26-1.3l11.5 6.9a1.5 1.5 0 0 1 0 2.6l-11.5 6.9A1.5 1.5 0 0 1 6 18.3z"],
  gitBranch: ["M6 3v12", "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M18 9a9 9 0 0 1-9 9"],
  sparkles: [
    "M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z",
  ],
};

export function icon(name, { x, y, size = 16, color, width = 2, fill = "none" }) {
  const s = size / 24;
  return `<g transform="translate(${x} ${y}) scale(${s})" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" fill="${fill}">${ICONS[name]
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g>`;
}

/** The mark: a black tile with a geometric D, like autocratico's A. */
export function mark({ x, y, size, bg, fg, id }) {
  const s = size / 100;
  return `<g transform="translate(${x} ${y})">
<clipPath id="${id}"><rect width="${size}" height="${size}" rx="${size * 0.24}"/></clipPath>
<g clip-path="url(#${id})">
<rect width="${size}" height="${size}" fill="${bg}"/>
<path transform="scale(${s})" fill="${fg}" fill-rule="evenodd" d="M27 20h21c19.5 0 31 11.6 31 30S67.5 80 48 80H27zm13 11.5v37h7.5C59 68.5 65.5 62 65.5 50S59 31.5 47.5 31.5z"/>
<polygon class="shine" style="--travel:${size * 2.4}px" points="${-size},${size} ${-size * 0.6},0 ${-size * 0.2},0 ${-size * 0.6},${size}" fill="url(#${id}-sh)"/>
</g>
<linearGradient id="${id}-sh" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</g>`;
}

/**
 * Liquid chrome orb, after autocratico's .chrome-orb: layered radial light on
 * a black field, a soft shadow below that breathes with the float.
 */
export function chromeOrb({ cx, cy, r, id, floor }) {
  return `<defs>
<radialGradient id="${id}-body" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#f6f6f6"/><stop offset=".38" stop-color="#ababab"/><stop offset=".7" stop-color="#3d3d3d"/><stop offset="1" stop-color="#0e0e0e"/></radialGradient>
<radialGradient id="${id}-hi" cx=".32" cy=".26" r=".2"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-rim" cx=".7" cy=".8" r=".3"><stop offset="0" stop-color="#d9d9d9" stop-opacity=".8"/><stop offset="1" stop-color="#d9d9d9" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-shade" cx=".38" cy=".32" r=".78"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="${id}-floor" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="${id}-studio" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="${cx}" cy="${cy}" r="${r * 2.1}" fill="url(#${id}-studio)"/>
<ellipse class="orb-floor" cx="${cx}" cy="${floor}" rx="${r * 0.8}" ry="${r * 0.13}" fill="url(#${id}-floor)"/>
<g class="orb">
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-body)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-rim)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-shade)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-hi)"/>
</g>`;
}

export const ORB_CSS = `
.orb{transform-box:fill-box;transform-origin:center;animation:float 9s ease-in-out infinite}
@keyframes float{50%{transform:translateY(-9px) rotate(4deg)}}
.orb-floor{transform-box:fill-box;transform-origin:center;animation:floor 9s ease-in-out infinite}
@keyframes floor{50%{transform:scale(.78);opacity:.55}}
`;

/** Card surface with the faint drop shadow light mode gets. */
export function card({ x, y, w, h, r = 22, fill, stroke, shadow = 0, id }) {
  const filter = shadow
    ? `<filter id="${id}" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#000" flood-opacity="${shadow}"/></filter>`
    : "";
  return `${filter}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${stroke ? `stroke="${stroke}"` : ""} ${shadow ? `filter="url(#${id})"` : ""}/>`;
}
