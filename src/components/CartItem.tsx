"use client";

import { memo } from "react";
import type { CartItem } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import Price from "@/components/ui/Price";

interface CartItemProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
  disabled: boolean;
}

function CartItemComponent({
  item,
  onIncrease,
  onDecrease,
  onDelete,
  disabled,
}: CartItemProps) {
  return (
    <article className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)]">
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
            aria-label={`Remove ${item.products.name} from cart`}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-full border border-border bg-surface-elevated">
            <button
              disabled={disabled}
              onClick={onDecrease}
              aria-label="Decrease quantity"
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors active:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={14} aria-hidden />
            </button>

            <span className="min-w-8 text-center text-sm font-medium tabular-nums">
              {item.quantity}
            </span>

            <button
              disabled={disabled}
              onClick={onIncrease}
              aria-label="Increase quantity"
              className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors active:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={14} aria-hidden />
            </button>
          </div>

          <Price
            value={item.products.price * item.quantity}
            className="font-display text-base text-foreground"
          />
        </div>
      </div>
    </article>
  );
}

export default memo(CartItemComponent);
