import { getCartItems } from "@/lib/repositories/cart";
import EmptyCart from "@/components/EmptyCart";
import CartClient from "@/components/CartClient";
import BottomNavigation from "@/components/BottomNavigation";
import { getCartCount } from "@/lib/repositories/cart";

export default async function CartPage() {
  const { data: items, error } = await getCartItems();
  const { count } = await getCartCount();
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
      <BottomNavigation cartCount={count} />
    </main>
  );
}
