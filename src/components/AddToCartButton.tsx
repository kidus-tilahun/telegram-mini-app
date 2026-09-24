"use client";
import { useCallback, useState } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { useTelegramSync } from "./TelegramProvider";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

interface AddToCartButtonProps {
  productId: string;
  quantity: number;
  stock: number;
}

export default function AddToCartButton({
  productId,
  quantity,
  stock,
}: AddToCartButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const router = useRouter();
  const { syncStatus } = useTelegramSync();

  const isSyncPending = syncStatus === "pending";
  const isOutOfStock = stock <= 0;

  const handleAddToCart = useCallback(async () => {
    setError(null);
    setIsMutating(true);

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setError("Telegram session not ready. Please try again.");
      setIsMutating(false);
      return;
    }

    try {
      const result = await addToCartAction(productId, quantity, initData);
      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } finally {
      setIsMutating(false);
    }
  }, [productId, quantity, router]);

  return (
    <div className="fixed inset-x-0 bottom-[calc(4rem+max(env(safe-area-inset-bottom),1rem))] z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
      {error && (
        <p
          role="alert"
          className="mb-2 rounded-xl bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <button
        disabled={isMutating || isSyncPending || isOutOfStock}
        onClick={handleAddToCart}
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[var(--shadow-float)] transition-transform active:scale-[0.98] disabled:opacity-50"
      >
        {isMutating || isSyncPending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {isSyncPending ? "Connecting..." : "Adding..."}
          </>
        ) : isOutOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag size={18} aria-hidden />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
