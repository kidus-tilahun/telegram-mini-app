import BottomNavigation from "@/components/BottomNavigation";
import CartClient from "@/components/CartClient";
import EmptyCart from "@/components/EmptyCart";
import { getCartCount, getCartItems } from "@/lib/repositories/cart";
import { getTelegramUser } from "@/lib/telegram/get-telegram-user";

export default async function CartPage() {
  const telegramUser = await getTelegramUser();
  const { data: items, error } = await getCartItems();
  const { count } = await getCartCount();

  if (error) {
    return <p>Failed to load cart.</p>;
  }

  const cartItems = items ?? [];

  return (
    <main>
      {!telegramUser && (
        <p className="mx-4 mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Open this app inside Telegram to view and manage your cart.
        </p>
      )}
      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <CartClient items={cartItems} />
      )}
      <BottomNavigation cartCount={count} />
    </main>
  );
}
