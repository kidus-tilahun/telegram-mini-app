import type { CartItem } from "@/types/cart";

interface CartSummaryProps {
  items: CartItem[];
}

export default function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0,
  );

  const shipping = subtotal === 0 || subtotal > 150 ? 0 : 12;

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

      <button className="mt-5 w-full rounded-full bg-primary py-4 text-primary-foreground">
        Checkout
      </button>
    </section>
  );
}
