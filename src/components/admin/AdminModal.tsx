"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Admin form modal: bottom sheet on mobile, centered card on desktop.
 * Handles scrim, body scroll lock, Escape-to-close and focus on open.
 */
export default function AdminModal({
  title,
  onClose,
  children,
}: AdminModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseRef.current();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onCloseRef.current()}
        aria-hidden="true"
      />

      {/* Sheet: bottom on mobile, centered on desktop */}
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className="animate-fade-up flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-[var(--shadow-float)] outline-none md:max-h-[85vh] md:max-w-lg md:rounded-3xl"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-3">
            <h2 className="font-display text-xl text-foreground">{title}</h2>
            <button
              type="button"
              onClick={() => onCloseRef.current()}
              aria-label="Close dialog"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors active:bg-muted"
            >
              <X size={20} strokeWidth={1.8} aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
