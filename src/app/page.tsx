import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import CategoryChips from "@/components/CategoryChips";
import PromoBanner from "@/components/PromoBanner";
import MembershipBanner from "@/components/MembershipBanner";
import BottomNavigation from "@/components/BottomNavigation";
import { getProducts } from "@/lib/repositories/products";
import { getStore } from "@/lib/repositories/store";
import { getCategories } from "@/lib/repositories/categories";
import { getCartCount } from "@/lib/repositories/cart";

export default async function Home() {
  const { count } = await getCartCount();
  const [
    { data: store, error: storeError },
    { data: categories, error: categoriesError },
    { data: featuredProducts, error: featuredProductsError },
    { data: newArrivals, error: newArrivalsError },
  ] = await Promise.all([
    getStore(),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 8 }),
  ]);

  if (
    storeError ||
    categoriesError ||
    featuredProductsError ||
    newArrivalsError
  ) {
    return <p>Failed to load data.</p>;
  }
  return (
    <main>
      <Header store={store} />
      <HeroBanner heroImageUrl={store.hero_image_url} />
      <CategoryChips categories={categories} />
      <PromoBanner imageUrl={store.promo_image_url} />
      {/* New arrivals */}
      <ProductSection title="New Arrivals" products={newArrivals ?? []} />
      {/* Popular this week */}
      <ProductSection
        title="Popular This Week"
        products={featuredProducts ?? []}
      />
      <MembershipBanner />
      <BottomNavigation cartCount={count} />
    </main>
  );
}
