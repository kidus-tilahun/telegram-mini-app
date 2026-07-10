import type { CartItem } from "@/types/cart";
import StickyCheckout from "./StickyCheckout";

interface CartSummaryProps {
  items: CartItem[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const FREE_SHIPPING_THRESHOLD = 150;
  const SHIPPING_COST = 12;

  const subtotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );

  const shipping =
    subtotal === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const total = subtotal + shipping;

  return (
    <section className="mt-6 rounded-2xl bg-surface-elevated p-5">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <StickyCheckout total={total} />
    </section>
  );
}
