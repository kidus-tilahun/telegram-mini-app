import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section>
      <h2>Featured Products</h2>
      {products.length === 0 ? (
        <section>
          <h2>Featured Products</h2>

          <p>No products available.</p>
        </section>
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </section>
  );
}
