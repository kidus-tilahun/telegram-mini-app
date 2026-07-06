"use client";
import { useState } from "react";
import { Minus } from "lucide-react";
import { Plus } from "lucide-react";

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);
  function increase() {
    setQuantity((q) => q + 1);
  }
  function decrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  return (
    <div>
      <section className="mt-6">
        <h2 className="font-display text-lg">Quantity</h2>
        <div className="mt-2 inline-flex items-center rounded-full border border-border bg-surface-elevated">
          <button
            onClick={decrease}
            aria-label="Decrease"
            className="grid h-11 w-11 place-items-center text-foreground"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-8 text-center text-sm font-medium">
            {quantity}
          </span>

          <button
            onClick={increase}
            aria-label="Increase"
            className="grid h-11 w-11 place-items-center text-foreground"
          >
            <Plus size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
