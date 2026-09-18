"use client";

import { useCallback } from "react";
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
  const handleIncrease = useCallback(
    (item: CartItemType) => onIncrease(item),
    [onIncrease],
  );
  const handleDecrease = useCallback(
    (item: CartItemType) => onDecrease(item),
    [onDecrease],
  );
  const handleDelete = useCallback(
    (item: CartItemType) => onDelete(item),
    [onDelete],
  );

  return (
    <section className="space-y-3 px-5">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => handleIncrease(item)}
          onDecrease={() => handleDecrease(item)}
          onDelete={() => handleDelete(item)}
          disabled={disabled}
        />
      ))}
    </section>
  );
}
