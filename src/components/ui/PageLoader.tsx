/** Centered page-level loading indicator. */
export default function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <main
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </main>
  );
}
