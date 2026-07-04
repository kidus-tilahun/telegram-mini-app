import type { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-2.5"
    >
      <article className="grid grid-cols-2 gap-x-3 gap-y-5 animate-fade-up">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-soft)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="w-auto size-full object-cover transition-transform duration-500 group-hover:scale-105 group-active:scale-[1.02]"
          />
        </div>

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
