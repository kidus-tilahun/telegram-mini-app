"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { ChevronLeft } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Price from "@/components/ui/Price";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const increase = useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  const decrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);
  return (
    <section className="relative -mt-2 pb-36">
      <header className="flex items-center px-4 py-3">
        <Link
          href="/shop"
          className="flex min-h-11 items-center gap-1 rounded-lg text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft size={18} aria-hidden />
          <span>Back</span>
        </Link>
      </header>
      {/*
        LCP element on the product page: the main image sits above the fold,
        so it must load eagerly with high fetch priority (was lazy-loaded,
        which delayed LCP until after scroll/interaction).
      */}
      <Image
        src={product.image}
        alt={product.name}
        width={800}
        height={1000}
        priority
        fetchPriority="high"
        sizes="448px"
        className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
      />
      <article className="px-5 pt-6 animate-fade-up space-y-4">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Boutique Collection
          </p>
          <h1 className="font-display text-3xl leading-tight text-foreground">
            {product.name}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border py-2">
          <Price
            value={product.price}
            className="shrink-0 font-display text-3xl font-medium text-foreground"
          />
          {product.stock > 0 ? (
            <Badge variant="success">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>

        <div className="py-2">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Quantity
          </p>
          <QuantitySelector
            quantity={quantity}
            increase={increase}
            decrease={decrease}
          />
        </div>
      </article>
      <AddToCartButton
        productId={product.id}
        quantity={quantity}
        stock={product.stock}
      />
    </section>
  );
}
