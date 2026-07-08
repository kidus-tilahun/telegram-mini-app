import { getCartItems } from "@/lib/repositories/cart";
import CartList from "@/components/CartList";
import EmptyCart from "@/components/EmptyCart";
import CartSummary from "@/components/CartSummary";

export default async function CartPage() {
  const { data: items, error } = await getCartItems();

  if (error) {
    return <p>Failed to load cart.</p>;
  }

  const cartItems = items ?? [];

  return (
    <main>
      {/* Header */}

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <CartList items={cartItems} />

          <CartSummary items={cartItems} />
        </>
      )}
    </main>
  );
}
