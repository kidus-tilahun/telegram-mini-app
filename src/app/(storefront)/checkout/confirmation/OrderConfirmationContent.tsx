"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getOrderConfirmationAction } from "@/app/actions/checkout";
import type { OrderConfirmation as OrderConfirmationType } from "@/app/actions/checkout";
import OrderConfirmation from "@/components/OrderConfirmation";
import PageLoader from "@/components/ui/PageLoader";
import ErrorState from "@/components/ui/ErrorState";

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderConfirmationType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      if (!orderId) {
        if (isMounted) setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) {
          if (isMounted) setError("Telegram session not ready");
          return;
        }

        const result = await getOrderConfirmationAction(initData, orderId);

        if (!result.success) {
          if (isMounted) setError(result.error);
          return;
        }

        if (isMounted) setOrder(result.order);
      } catch {
        if (isMounted) setError("Failed to load order confirmation");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return <PageLoader label="Loading your order…" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!order) {
    return <ErrorState message="Order not found." />;
  }

  return (
    <main className="mx-auto max-w-md px-5 py-6">
      <OrderConfirmation order={order} />
    </main>
  );
}
