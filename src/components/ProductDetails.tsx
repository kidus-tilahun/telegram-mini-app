"use client";
import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  function increase() {
    setQuantity((q) => q + 1);
  }

  function decrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  return (
    <section className="relative -mt-2 pb-36">
      <header className="flex items-center px-4 py-3">
        <Link
          href="/shop"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back</span>
        </Link>
      </header>
      <Image
        src={product.image}
        alt={product.name}
        width={800}
        height={1000}
        className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
        priority
      />
      <article className="px-5 pt-6 animate-fade-up space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">
            Boutique Collection
          </p>
          <h1 className="font-display text-3xl leading-tight text-foreground">
            {product.name}
          </h1>
        </div>

        <div className="flex items-baseline justify-between gap-3 py-2 border-b border-border">
          <p className="shrink-0 font-display text-3xl font-medium text-foreground">
            ETB {product.price.toLocaleString()}
          </p>
          {product.stock > 0 ? (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
              Out of Stock
            </span>
          )}
        </div>

        <div className="py-2">
          <p className="text-xs text-muted-foreground mb-3">Quantity</p>
          <QuantitySelector
            quantity={quantity}
            increase={increase}
            decrease={decrease}
          />
        </div>
      </article>
      <div className="fixed inset-x-0 bottom-24 z-30 px-4">
        <AddToCartButton productId={product.id} quantity={quantity} />
      </div>
    </section>
  );
}
