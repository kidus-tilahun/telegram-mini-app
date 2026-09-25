"use client";

import CartItem from "./CartItem";

import type { CartItem as CartItemType } from "@/types/cart";

interface CartListProps {
  items: CartItemType[];
  onIncrease: (item: CartItemType) => void;
  onDecrease: (item: CartItemType) => void;
  onDelete: (item: CartItemType) => void;
  disabled: boolean;
}

export default function CartList({
  items,
  onIncrease,
  onDecrease,
  onDelete,
  disabled,
}: CartListProps) {
  return (
    <section className="space-y-3 px-5 pt-5">
      <h1 className="mb-4 font-display text-3xl text-foreground">Your Bag</h1>
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onDelete={onDelete}
          disabled={disabled}
        />
      ))}
    </section>
  );
}
