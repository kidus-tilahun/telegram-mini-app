import Image from "next/image";
import type { Product } from "@/types/product";
import QuantitySelector from "./QuantitySelector";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <section className="relative -mt-2">
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

        <QuantitySelector />
      </article>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
        <div className="glass-nav flex items-center gap-3 rounded-full p-2 pl-5 shadow-[var(--shadow-float)]">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Total
            </p>
            <p className="font-display text-lg leading-none text-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>
          <button
            disabled={product.stock === 0}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-slate-600 px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
