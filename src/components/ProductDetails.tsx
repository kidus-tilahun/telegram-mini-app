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
    <section className="relative -mt-2">
      <header className="flex items-center p-5">
        <Link href="/shop">← Back</Link>
      </header>
      <Image
        src={product.image}
        alt={product.name}
        width={800}
        height={1000}
        className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
      />
      <article className="px-5 pt-5 animate-fade-up">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Category
        </p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <h1 className="font-display text-2xl leading-tight text-foreground">
            {product.name}
          </h1>

          <p className="shrink-0 font-display text-2xl text-foreground">
            ${product.price.toLocaleString()}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {product.stock > 0 ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
              Out of Stock
            </span>
          )}
        </div>

        <QuantitySelector
          quantity={quantity}
          increase={increase}
          decrease={decrease}
        />
        <AddToCartButton productId={product.id} quantity={quantity} />
      </article>
    </section>
  );
}
