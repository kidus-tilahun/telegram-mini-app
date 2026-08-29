"use client";

import { useOptimistic, useState, useTransition } from "react";

import CartList from "./CartList";
import CartSummary from "./CartSummary";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      const result = await updateQuantityAction(item.id, quantity);
      if (!result.success) {
        setError(result.error);
        router.refresh();
        return;
      }

      router.refresh();
    });
  }

  function deleteItem(item: CartItem) {
    updateOptimisticItems({
      type: "delete",
      id: item.id,
    });

    startTransition(async () => {
      const result = await removeFromCartAction(item.id);
      if (!result.success) {
        setError(result.error);
        router.refresh();
        return;
      }

      router.refresh();
    });
  }

  return (
    <>
      {error && (
        <p className="mx-4 mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="pb-36">
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
