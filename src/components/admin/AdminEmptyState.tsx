import type { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Admin empty state with icon, copy and optional primary action. */
export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-12 text-center">
      <div
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground"
      >
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <h2 className="mt-5 font-display text-2xl text-foreground">{title}</h2>

      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}
