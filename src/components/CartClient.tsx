"use client";

import { useOptimistic, useTransition } from "react";

import CartList from "./CartList";
import CartSummary from "./CartSummary";

import { updateQuantityAction, removeFromCartAction } from "@/app/actions/cart";

import type { CartItem } from "@/types/cart";

interface CartClientProps {
  items: CartItem[];
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

export default function CartClient({ items }: CartClientProps) {
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

  function changeQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;

    updateOptimisticItems({
      type: "update",
      id: item.id,
      quantity,
    });

    startTransition(async () => {
      await updateQuantityAction(item.id, quantity);
    });
  }

  function deleteItem(item: CartItem) {
    updateOptimisticItems({
      type: "delete",
      id: item.id,
    });

    startTransition(async () => {
      await removeFromCartAction(item.id);
    });
  }

  return (
    <>
      <div className="pb-28">
        <CartList
          items={optimisticItems}
          onIncrease={(item) => changeQuantity(item, item.quantity + 1)}
          onDecrease={(item) => changeQuantity(item, item.quantity - 1)}
          onDelete={deleteItem}
          disabled={isPending}
        />

        <CartSummary items={optimisticItems} />
      </div>
    </>
  );
}
