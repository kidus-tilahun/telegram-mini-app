"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import CartClient from "@/components/CartClient";
import EmptyCart from "@/components/EmptyCart";
import { getCartItemsAction, getCartCountAction } from "@/app/actions/cart";

import type { CartItem } from "@/types/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCart() {
      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
          setError("Telegram session not ready. Please try again.");
          setLoading(false);
          return;
        }

        const [itemsResult, countResult] = await Promise.all([
          getCartItemsAction(initData),
          getCartCountAction(initData),
        ]);

        if (!itemsResult.success) {
          setError(itemsResult.error);
          setLoading(false);
          return;
        }

        if (!countResult.success) {
          setError(countResult.error);
          setLoading(false);
          return;
        }

        setItems(itemsResult.data);
        setCount(countResult.count);
      } catch (err) {
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return <p className="mx-4 mt-4 text-red-600">{error}</p>;
  }

  const cartItems = items ?? [];

  return (
    <main>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartClient items={cartItems} />
      )}
      <BottomNavigation cartCount={count} />
    </main>
  );
}
