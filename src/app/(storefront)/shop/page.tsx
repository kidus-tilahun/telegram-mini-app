import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import { SearchX } from "lucide-react";
import { getCartCountFromCookie } from "@/lib/repositories/cart";

import {
  getProducts,
  getProductsByCategory,
} from "@/lib/repositories/products";

import { getCategories } from "@/lib/repositories/categories";
import BottomNavigation from "@/components/BottomNavigation";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, category } = await searchParams;
  const { count } = await getCartCountFromCookie();
  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    category ? getProductsByCategory(category) : getProducts({ search: q }),
    getCategories(),
  ]);

  if (productsError || categoriesError) {
    return <ErrorState message="Unable to load products." />;
  }

  return (
    <>
      <SearchBar />

      <CategoryFilter categories={categories ?? []} />

      {(products ?? []).length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No products found"
          description="Try a different search or browse another category."
          actionLabel="Browse the shop"
          actionHref="/shop"
        />
      ) : (
        <section className="mt-3 px-5">
          <div className="grid grid-cols-2 gap-x-3 gap-y-5 animate-fade-up">
            {(products ?? []).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      <BottomNavigation cartCount={count} />
    </>
  );
}
