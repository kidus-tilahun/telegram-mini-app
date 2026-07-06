"use client";
import { useState } from "react";
import { addToCart } from "@/lib/repositories/cart";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  quantity,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);

    const { error } = await addToCart(productId, quantity);
    setLoading(false);
    if (error) {
      alert("Failed to add to cart.");
      return;
    }
    alert("Added to cart!");
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      <div className="bg-gray-400 flex items-center gap-3 rounded-full p-2 pl-5 shadow-[var(--shadow-float)]">
        <button
          disabled={loading}
          onClick={handleAddToCart}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
