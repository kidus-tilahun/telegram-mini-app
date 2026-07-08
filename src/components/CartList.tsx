"use client";

import { useOptimistic, useTransition } from "react";
import { updateQuantityAction, removeFromCartAction } from "@/app/actions/cart";
import CartItem from "./CartItem";
import type { CartItem as CartItemType } from "@/types/cart";

interface CartListProps {
  items: CartItemType[];
}

type CartAction =
  | {
      type: "update";
      id: string;
      quantity: number;
    }
  | {
      type: "delete";
      id: string;
    };

export default function CartList({ items }: CartListProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    items,
    (state, action: CartAction) => {
      switch (action.type) {
        case "update":
          return state.map((item) =>
            item.id === action.id
              ? { ...item, quantity: action.quantity }
              : item,
          );

        case "delete":
          return state.filter((item) => item.id !== action.id);
      }
    },
  );

  function changeQuantity(item: CartItemType, quantity: number) {
    updateOptimisticItems({
      type: "update",
      id: item.id,
      quantity,
    });

    startTransition(async () => {
      await updateQuantityAction(item.id, quantity);
    });
  }

  function handleDelete(item: CartItemType) {
    updateOptimisticItems({
      type: "delete",
      id: item.id,
    });

    startTransition(async () => {
      await removeFromCartAction(item.id);
    });
  }

  return (
    <section className="space-y-3 px-5">
      {optimisticItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={() => changeQuantity(item, item.quantity + 1)}
          onDecrease={() => changeQuantity(item, item.quantity - 1)}
          onDelete={() => handleDelete(item)}
          disabled={isPending}
        />
      ))}
    </section>
  );
}
