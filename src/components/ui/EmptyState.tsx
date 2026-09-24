import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

/** Intentional empty state with icon, copy and optional primary action. */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <section className="mt-16 flex flex-col items-center px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon size={32} strokeWidth={1.5} aria-hidden />
      </div>

      <h2 className="mt-6 font-display text-2xl text-foreground">{title}</h2>

      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
        >
          {actionLabel}
        </a>
      )}
    </section>
  );
}
