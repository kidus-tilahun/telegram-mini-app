"use client";
import type { CartItem } from "@/types/cart";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { updateQuantityAction, removeFromCartAction } from "@/app/actions/cart";

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  async function handleQuantityAddition() {
    startTransition(async () => {
      await updateQuantityAction(item.id, item.quantity + 1);
    });
  }
  async function handleQuantitySubtruction() {
    startTransition(async () => {
      await updateQuantityAction(item.id, item.quantity - 1);
    });
  }
  async function handleProductDeletion() {
    startTransition(async () => {
      await removeFromCartAction(item.id);
    });
  }

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

          <button disabled={isPending} onClick={handleProductDeletion}>
            🗑️
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3">
            <button disabled={isPending} onClick={handleQuantitySubtruction}>
              -
            </button>

            <span>{item.quantity}</span>

            <button disabled={isPending} onClick={handleQuantityAddition}>
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
