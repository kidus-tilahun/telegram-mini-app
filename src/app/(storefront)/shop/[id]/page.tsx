import ProductDetails from "@/components/ProductDetails";
import RelatedProducts from "@/components/RelatedProducts";
import ErrorState from "@/components/ui/ErrorState";
import { getProductById } from "@/lib/repositories/products";
import { getCartCountFromCookie } from "@/lib/repositories/cart";
import BottomNavigation from "@/components/BottomNavigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product, error } = await getProductById(id);
  const { count } = await getCartCountFromCookie();

  if (error || !product) {
    return <ErrorState message="Product not found." />;
  }
  return (
    <main>
      <ProductDetails product={product} />
      <RelatedProducts
        categoryId={product.category_id}
        currentProductId={product.id}
      />
      <BottomNavigation cartCount={count} />
    </main>
  );
}
