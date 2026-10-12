import { cn } from "@/lib/utils";

/** Section shell: a black index tile, the title, a muted line, a hairline to the edge. */
export function Section({
  id,
  index,
  title,
  detail,
  action,
  className,
  children,
}: {
  id: string;
  index: string;
  title: string;
  detail: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-32 lg:scroll-mt-24", className)}>
      <div data-reveal className="mb-4 flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary font-mono text-xs font-medium text-primary-foreground">
          {index}
        </span>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="hidden truncate text-sm text-muted-foreground sm:block">{detail}</p>
        <span aria-hidden className="ml-2 hidden h-px flex-1 bg-border sm:block" />
        {action && <div className="ml-auto shrink-0 sm:ml-0">{action}</div>}
      </div>
      <p className="-mt-2 mb-4 text-sm text-muted-foreground sm:hidden">{detail}</p>
      {children}
    </section>
  );
}

/** The card surface every block sits on. `data-card` opts into the pointer spotlight. */
export function Card({
  className,
  children,
  as: Tag = "div",
  ...rest
}: { as?: "div" | "article" | "a" | "li"; className?: string; children: React.ReactNode } & Record<string, unknown>) {
  return (
    <Tag data-card data-reveal className={cn("rounded-3xl border bg-card text-card-foreground", className)} {...rest}>
      {children}
    </Tag>
  );
}
