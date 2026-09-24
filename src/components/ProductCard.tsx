import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import Badge from "@/components/ui/Badge";
import Price from "@/components/ui/Price";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="group flex flex-col gap-2.5 rounded-2xl transition-transform active:scale-[0.99]"
    >
      <article className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className={`size-full object-cover transition-transform duration-300 group-hover:scale-105 group-active:scale-[1.02] ${outOfStock ? "opacity-60 saturate-50" : ""}`}
        />

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/50 to-transparent p-3">
            <Badge
              variant="destructive"
              className="bg-white/90 text-destructive"
            >
              Out of stock
            </Badge>
          </div>
        )}
      </article>

      <div className="flex flex-col gap-0.5 px-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {product.name}
        </p>
        <Price
          value={product.price}
          className="text-sm text-muted-foreground"
        />
      </div>
    </Link>
  );
}

export default memo(ProductCardComponent);
