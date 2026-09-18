"use client";

import { useCallback, useOptimistic, useState } from "react";

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
      previousQuantity: number;
    }
  | {
      type: "delete";
      id: string;
      item: CartItem;
    };

export default function CartClient({ items }: CartClientProps) {
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
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

  const changeQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity < 1) {
        await deleteItem(item);
        return;
      }

      setError(null);
      setIsMutating(true);

      // Store previous quantity for potential rollback
      const previousQuantity = item.quantity;

      updateOptimisticItems({
        type: "update",
        id: item.id,
        quantity,
        previousQuantity,
      });

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) {
        setError("Telegram session not ready. Please try again.");
        // Revert optimistic update
        updateOptimisticItems({
          type: "update",
          id: item.id,
          quantity: previousQuantity,
          previousQuantity: quantity,
        });
        setIsMutating(false);
        return;
      }

      try {
        const result = await updateQuantityAction(item.id, quantity, initData);
        if (!result.success) {
          setError(result.error);
          // Revert optimistic update
          updateOptimisticItems({
            type: "update",
            id: item.id,
            quantity: previousQuantity,
            previousQuantity: quantity,
          });
          setIsMutating(false);
          return;
        }

        // Success: refresh to sync server state
        router.refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [router, updateOptimisticItems],
  );

  const deleteItem = useCallback(
    async (item: CartItem) => {
      setError(null);
      setIsMutating(true);

      updateOptimisticItems({
        type: "delete",
        id: item.id,
        item,
      });

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) {
        setError("Telegram session not ready. Please try again.");
        // Revert optimistic update by re-adding the item
        updateOptimisticItems({
          type: "update",
          id: item.id,
          quantity: item.quantity,
          previousQuantity: 0,
        });
        setIsMutating(false);
        return;
      }

      try {
        const result = await removeFromCartAction(item.id, initData);
        if (!result.success) {
          setError(result.error);
          // Revert optimistic update by re-adding the item
          updateOptimisticItems({
            type: "update",
            id: item.id,
            quantity: item.quantity,
            previousQuantity: 0,
          });
          setIsMutating(false);
          return;
        }

        // Success: refresh to sync server state
        router.refresh();
      } finally {
        setIsMutating(false);
      }
    },
    [router, updateOptimisticItems],
  );

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
          disabled={isMutating}
        />

        <CartSummary items={optimisticItems} />
      </div>
    </>
  );
}
