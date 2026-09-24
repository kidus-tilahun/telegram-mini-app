"use client";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  increase: () => void;
  decrease: () => void;
}

export default function QuantitySelector({
  quantity,
  increase,
  decrease,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface-elevated shadow-[var(--shadow-soft)]">
      <button
        onClick={decrease}
        aria-label="Decrease quantity"
        className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors active:bg-muted"
      >
        <Minus size={16} aria-hidden />
      </button>
      <span
        className="min-w-8 text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>

      <button
        onClick={increase}
        aria-label="Increase quantity"
        className="grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors active:bg-muted"
      >
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
