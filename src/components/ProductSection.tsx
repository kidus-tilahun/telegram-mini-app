import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({
  title,
  products,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-8 px-5">
      <SectionHeading title={title} actionLabel="View all" actionHref="/shop" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
