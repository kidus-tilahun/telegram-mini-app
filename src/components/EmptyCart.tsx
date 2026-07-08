import Link from "next/link";

export default function EmptyCart() {
  return (
    <section className="mt-20 flex flex-col items-center text-center">
      <div className="text-6xl">🛍️</div>

      <h2 className="mt-5 text-2xl font-bold">Your bag is empty</h2>

      <p className="mt-2 max-w-xs text-muted-foreground">
        Discover amazing products and start filling your cart.
      </p>

      <Link
        href="/shop"
        className="mt-6 rounded-full bg-primary px-6 py-3 text-primary-foreground"
      >
        Browse Shop
      </Link>
    </section>
  );
}
