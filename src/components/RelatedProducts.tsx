import { getRelatedProducts } from "@/lib/repositories/products";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const { data: products, error } = await getRelatedProducts(
    categoryId,
    currentProductId,
  );

  if (error || !products?.length) {
    return null;
  }

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>

      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
