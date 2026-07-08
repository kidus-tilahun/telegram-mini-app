import { getCartItems } from "@/lib/repositories/cart";
import CartItem from "@/components/CartItem";
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
      {/* header */}

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <section className="space-y-3 px-5">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </section>

          <CartSummary items={cartItems} />
        </>
      )}
    </main>
  );
}
