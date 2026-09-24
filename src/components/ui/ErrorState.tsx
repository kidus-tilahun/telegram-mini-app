import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
}

/** Intentional error state card. */
export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <main className="flex min-h-[40vh] items-center justify-center px-6">
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
        <AlertCircle size={28} className="text-destructive" aria-hidden />
        <h2 className="font-display text-xl text-foreground">
          Something went wrong
        </h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </main>
  );
}
