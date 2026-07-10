"use client";

import type { CartItem } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  disabled: boolean;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onDelete,
  disabled,
}: CartItemProps) {
  return (
    <article className="flex gap-3 rounded-2xl bg-surface-elevated p-3 shadow-[var(--shadow-soft)]">
      <Link href={`/shop/${item.products.id}`} className="shrink-0">
        <Image
          src={item.products.image}
          alt={item.products.name}
          width={80}
          height={96}
          className="h-24 w-20 rounded-xl object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-medium text-foreground">
            {item.products.name}
          </h3>

          <button
            disabled={disabled}
            onClick={onDelete}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-destructive disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              disabled={disabled}
              onClick={onDecrease}
              className="grid h-9 w-9 place-items-center disabled:opacity-50"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>

            <button
              disabled={disabled}
              onClick={onIncrease}
              className="grid h-9 w-9 place-items-center disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>

          <p className="font-display text-base text-foreground">
            ${(item.products.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </article>
  );
}
