import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
}

/** KPI stat card for the admin dashboard. */
export default function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: StatCardProps) {
  const card = (
    <div className="h-full rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <div
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
        >
          <Icon size={15} strokeWidth={1.8} />
        </div>
      </div>
      <p className="mt-2 truncate font-display text-2xl text-foreground tabular-nums">
        {value}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={`${label}: ${value}`}
        className="block h-full transition-transform active:scale-[0.99]"
      >
        {card}
      </Link>
    );
  }

  return card;
}
