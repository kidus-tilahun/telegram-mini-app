import { getCartItems } from "@/lib/repositories/cart";

import EmptyCart from "@/components/EmptyCart";
import CartClient from "@/components/CartClient";
import BottomNavigation from "@/components/BottomNavigation";

export default async function CartPage() {
  const { data: items, error } = await getCartItems();

  if (error) {
    return <p>Failed to load cart.</p>;
  }

  const cartItems = items ?? [];

  return (
    <main>
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartClient items={cartItems} />
      )}
      <BottomNavigation />
    </main>
  );
}
