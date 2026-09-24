import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

/** Consistent storefront section heading with optional "view all" action. */
export default function SectionHeading({
  title,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="text-xs font-medium text-accent underline-offset-4 hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
