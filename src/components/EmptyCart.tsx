import Link from "next/link";

export default function EmptyCart() {
  return (
    <section className="mt-20 flex flex-col items-center px-6 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-gray-100 text-4xl">
        🛍️
      </div>

      <h2 className="mt-6 text-2xl font-bold">Your bag is empty</h2>

      <p className="mt-2 text-sm text-gray-500">
        Browse our boutique and discover your next favorite piece.
      </p>

      <Link
        href="/shop"
        className="mt-8 rounded-full bg-black px-8 py-4 text-white transition hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </section>
  );
}
