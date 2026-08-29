"use client";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { useTelegramSync } from "./TelegramProvider";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  quantity,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { syncStatus } = useTelegramSync();

  const isSyncPending = syncStatus === "pending";

  function handleAddToCart() {
    setError(null);

    startTransition(async () => {
      const result = await addToCartAction(productId, quantity);
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      {error && (
        <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="bg-gray-400 flex items-center gap-3 rounded-full p-2 pl-5 shadow-[var(--shadow-float)]">
        <button
          disabled={isPending || isSyncPending}
          onClick={handleAddToCart}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition-transform active:scale-95 disabled:opacity-50"
        >
          {isPending || isSyncPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {isSyncPending ? "Connecting..." : "Adding..."}
            </>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
