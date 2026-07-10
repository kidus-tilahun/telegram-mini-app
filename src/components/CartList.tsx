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
    <section className="space-y-3 px-5">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
          onDelete={() => onDelete(item)}
          disabled={disabled}
        />
      ))}
    </section>
  );
}
