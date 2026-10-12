"use client";

import { CornerDownLeft, Search, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  icon: LucideIcon;
  hint?: string;
  run: () => void;
}

/** ⌘K: a native <dialog> with a filter, arrow keys and Enter. */
export function Palette({ open, onClose, items }: { open: boolean; onClose: () => void; items: PaletteItem[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      setQuery("");
      setIndex(0);
      d.showModal();
    } else if (!open && d.open) d.close();
  }, [open]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => `${i.label} ${i.group} ${i.hint ?? ""}`.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const run = (item: PaletteItem | undefined) => {
    if (!item) return;
    onClose();
    // Let the dialog close (and give focus back) before scrolling or opening a tab.
    requestAnimationFrame(item.run);
  };

  let lastGroup = "";
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Search and jump"
      className="palette m-auto mt-[12vh] w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-card p-0 text-foreground shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b px-4">
        <Search className="size-4 text-muted-foreground" aria-hidden />
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(shown.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              run(shown[index]);
            }
          }}
          placeholder="Jump to a section, open a link…"
          aria-label="Search"
          aria-controls="palette-list"
          aria-activedescendant={shown[index] ? `palette-${shown[index].id}` : undefined}
          className="h-13 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
        <kbd className="rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-[min(420px,60vh)] overflow-y-auto p-2">
        {shown.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing matches “{query}”.</li>}
        {shown.map((item, i) => {
          const heading = item.group !== lastGroup ? item.group : null;
          lastGroup = item.group;
          const Icon = item.icon;
          return (
            <li key={item.id} role="presentation">
              {heading && <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">{heading}</p>}
              <button
                type="button"
                id={`palette-${item.id}`}
                role="option"
                aria-selected={i === index}
                onMouseMove={() => setIndex(i)}
                onClick={() => run(item)}
                className={cn(
                  "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition-colors",
                  i === index && "bg-primary text-primary-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1 truncate font-medium">{item.label}</span>
                {item.hint && <span className="font-mono text-[11px] opacity-60">{item.hint}</span>}
                {i === index && <CornerDownLeft className="size-3.5 opacity-70" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>
    </dialog>
  );
}
