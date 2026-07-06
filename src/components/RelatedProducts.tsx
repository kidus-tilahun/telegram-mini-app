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
    <section className="mt-10">
      <h2 className="font-display text-xl">You may also like</h2>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
