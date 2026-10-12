"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

/** Copies the address; the icon turns into a check that lands, then goes back. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-ink-foreground px-4 text-sm font-medium text-ink transition-transform duration-150 hover:-translate-y-px active:scale-[.98]"
    >
      {copied ? <Check key="check" className="pop size-4" aria-hidden /> : <Copy key="copy" className="size-4" aria-hidden />}
      <span className="font-mono text-[13px]">{email}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}
