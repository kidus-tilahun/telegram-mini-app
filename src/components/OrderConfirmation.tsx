"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import type { OrderConfirmation } from "@/app/actions/checkout";
import Badge from "@/components/ui/Badge";

interface OrderConfirmationProps {
  order: OrderConfirmation;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <Check
            size={32}
            strokeWidth={2}
            className="text-success"
            aria-hidden
          />
        </div>
        <h1 className="font-display text-3xl text-foreground">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-muted-foreground">
          Thank you for your order. We will contact you soon to confirm
          delivery.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg text-foreground">Order Details</h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Checkout ID</span>
            <span className="font-mono text-xs">
              {order.checkoutId.slice(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="success">{order.status}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Placed</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg text-foreground">
          Customer Information
        </h2>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-muted-foreground">Name</span>
            <span className="text-right">{order.customerName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-muted-foreground">Phone</span>
            <span>{order.phone}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-muted-foreground">
              Delivery Address
            </span>
            <span className="text-right">{order.deliveryAddress}</span>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg text-foreground">Order Items</h2>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border/50 py-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qty: {item.quantity} x ETB {item.price.toLocaleString()}
                </p>
              </div>
              <p className="text-right text-sm font-medium text-foreground">
                ETB {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">
            ETB {order.total.toLocaleString()}
          </span>
        </div>
      </section>

      <div className="rounded-2xl bg-accent/10 p-4 text-sm text-foreground">
        <p className="font-medium text-accent">Payment on Delivery</p>
        <p className="mt-1 text-muted-foreground">
          No payment is required now. You will pay when your order is delivered.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98]"
        >
          Continue Shopping
        </Link>
        <Link
          href="/cart"
          className="inline-flex h-14 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground transition-colors active:bg-muted"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}
