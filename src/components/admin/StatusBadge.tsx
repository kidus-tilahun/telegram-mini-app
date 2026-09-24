import Badge from "@/components/ui/Badge";

const statusVariants: Record<
  string,
  "neutral" | "success" | "destructive" | "accent"
> = {
  pending: "accent",
  processing: "neutral",
  completed: "success",
  cancelled: "destructive",
};

/**
 * Order status badge using shared design-system tokens (label + tint, never
 * color alone). Status values are matched case-insensitively because the
 * checkout function writes lowercase "pending" while the admin UI writes
 * capitalized values.
 */
export default function StatusBadge({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <Badge variant={statusVariants[status.toLowerCase()] ?? "neutral"}>
      {label}
    </Badge>
  );
}
