"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartItemsAction, getCartCountAction } from "@/app/actions/cart";
import BottomNavigation from "@/components/BottomNavigation";
import CheckoutForm from "@/components/CheckoutForm";
import EmptyCart from "@/components/EmptyCart";

export default function CheckoutPage() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      quantity: number;
      products: {
        id: string;
        name: string;
        image: string;
        price: number;
      };
    }>
  >([]);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
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

        const cartItems = itemsResult.data ?? [];
        const cartTotal = cartItems.reduce(
          (sum, item) => sum + item.products.price * item.quantity,
          0,
        );

        setItems(cartItems);
        setCount(countResult.count);
        setTotal(cartTotal);
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

  if (cartItems.length === 0) {
    return (
      <main>
        <EmptyCart />
        <BottomNavigation cartCount={count} />
      </main>
    );
  }

  return (
    <main className="pb-32">
      <div className="mx-auto max-w-md px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <CheckoutForm items={cartItems} total={total} />
      </div>
      <BottomNavigation cartCount={count} />
    </main>
  );
}
