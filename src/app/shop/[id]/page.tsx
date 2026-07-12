import ProductDetails from "@/components/ProductDetails";
import RelatedProducts from "@/components/RelatedProducts";
import { getProductById } from "@/lib/repositories/products";
import { getCartCount } from "@/lib/repositories/cart";
import BottomNavigation from "@/components/BottomNavigation";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product, error } = await getProductById(id);
  const { count } = await getCartCount();

  if (error || !product) {
    return <h1>Product not found</h1>;
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
