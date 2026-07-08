"use client";

import type { CartItem } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";

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
          <h3 className="truncate text-sm font-medium">{item.products.name}</h3>

          <button disabled={disabled} onClick={onDelete}>
            🗑️
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3">
            <button disabled={disabled} onClick={onDecrease}>
              -
            </button>

            <span>{item.quantity}</span>

            <button disabled={disabled} onClick={onIncrease}>
              +
            </button>
          </div>

          <p className="font-semibold">
            ${(item.products.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </article>
  );
}
