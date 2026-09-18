import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.id}`} className="group flex flex-col gap-2.5">
      <article className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="w-auto size-full object-cover transition-transform duration-300 group-hover:scale-105 group-active:scale-[1.02]"
        />

        <div className="flex flex-col gap-0.5 px-0.5">
          <p className="truncate text-sm font-medium text-foreground">
            {product.name}
          </p>
          <p className="text-sm text-muted-foreground">
            ETB {product.price.toLocaleString()}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default memo(ProductCardComponent);
