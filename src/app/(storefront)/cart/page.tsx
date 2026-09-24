"use client";

import { useEffect, useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import CartClient from "@/components/CartClient";
import EmptyCart from "@/components/EmptyCart";
import PageLoader from "@/components/ui/PageLoader";
import ErrorState from "@/components/ui/ErrorState";
import { getCartItemsAction, getCartCountAction } from "@/app/actions/cart";

import type { CartItem } from "@/types/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <PageLoader label="Loading your bag…" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  const cartItems = items ?? [];

  return (
    <main>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartClient items={cartItems} setItems={setItems} setCount={setCount} />
      )}
      <BottomNavigation cartCount={count} />
    </main>
  );
}
