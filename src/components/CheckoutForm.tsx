"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import { placeOrderAction } from "@/app/actions/checkout";

interface CheckoutFormProps {
  items: Array<{
    id: string;
    quantity: number;
    products: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
  }>;
  total: number;
}

export default function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    deliveryAddress: "",
  });
  const router = useRouter();

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.customerName.trim()) {
      setError("Customer name is required");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!formData.deliveryAddress.trim()) {
      setError("Delivery address is required");
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setError("Telegram session not ready. Please try again.");
      return;
    }

    const checkoutId = crypto.randomUUID();

    startTransition(async () => {
      const result = await placeOrderAction({
        initData,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        deliveryAddress: formData.deliveryAddress.trim(),
        checkoutId,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(`/checkout/confirmation?orderId=${result.orderId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="font-display text-xl text-foreground">
          Customer Information
        </h2>

        <div>
          <label
            htmlFor="customerName"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Full Name{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </label>
          <input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            placeholder="Enter your full name"
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Phone Number{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-surface-elevated px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            placeholder="Enter your phone number"
            disabled={isPending}
          />
        </div>

        <div>
          <label
            htmlFor="deliveryAddress"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Delivery Address{" "}
            <span aria-hidden className="text-destructive">
              *
            </span>
          </label>
          <textarea
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(e) => handleChange("deliveryAddress", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            placeholder="Enter your full delivery address"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <h2 className="font-display text-xl text-foreground">Order Summary</h2>

        <div className="max-h-64 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-border/50 py-2"
            >
              <img
                src={item.products.image}
                alt={item.products.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.products.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} × ETB{" "}
                  {item.products.price.toLocaleString()}
                </p>
              </div>
              <p className="text-right text-sm font-medium text-foreground">
                ETB {(item.products.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">ETB {total.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="space-y-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-14 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Placing Order...
            </span>
          ) : (
            "Place Order"
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          No payment required now. Pay on delivery.
        </p>
      </div>
    </form>
  );
}
