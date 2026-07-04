import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function FeaturedProducts({
  title,
  products,
}: ProductSectionProps) {
  return (
    <section className="mt-8 px-5">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        <Link
          href="/products"
          className="text-xs font-medium text-muted-foreground"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
