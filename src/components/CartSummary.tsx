import type { CartItem } from "@/types/cart";
import StickyCheckout from "./StickyCheckout";
import Price from "@/components/ui/Price";

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
    <section className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <h2 className="font-display text-xl text-foreground">Order Summary</h2>

      <div className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <Price value={subtotal} className="text-foreground" />
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {shipping === 0 ? "Free" : <Price value={shipping} />}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-foreground">Total</span>
            <Price value={total} className="text-foreground" />
          </div>
        </div>
      </div>

      <StickyCheckout total={total} />
    </section>
  );
}
