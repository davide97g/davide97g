/**
 * Light/dark without a provider: the class on <html> is the state, set before
 * paint by the inline script in app/layout.tsx and saved per browser.
 */

export type Theme = "light" | "dark";

const KEY = "theme";

/** Runs inline in <head>, before the first paint. Keep it dependency-free. */
export const themeScript = `(()=>{try{var d=document.documentElement,s=localStorage.getItem("${KEY}");var t=s||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");d.classList.toggle("dark",t==="dark");}catch(e){}document.documentElement.classList.add("js")})()`;

export function currentTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: the switch still works for this visit.
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

/** The new theme spreads in a circle from the point that asked for it. */
export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = currentTheme() === "dark" ? "light" : "dark";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) {
    apply(next);
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(() => apply(next)).ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
}
