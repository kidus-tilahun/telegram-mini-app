import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import CategoryChips from "@/components/CategoryChips";
import PromoBanner from "@/components/PromoBanner";
import MembershipBanner from "@/components/MembershipBanner";
import BottomNavigation from "@/components/BottomNavigation";

export default async function Home() {
  const [storeResult, productsResult, categoriesResult] = await Promise.all([
    supabase.from("store_settings").select("*").single(),
    supabase.from("products").select("*").eq("featured", true),
    supabase.from("categories").select("*").order("name"),
  ]);

  const { data: store, error: storeError } = storeResult;
  const { data: categories, error: categoriesError } = categoriesResult;
  const { data: products, error: productsError } = productsResult;

  if (storeError || productsError || categoriesError) {
    return <p>Failed to load data.</p>;
  }
  return (
    <main>
      <Header store={store} />
      <HeroBanner heroImageUrl={store.hero_image_url} />
      <CategoryChips categories={categories} />
      <PromoBanner imageUrl={store.promo_image_url} />
      {/* New arrivals */}
      <ProductSection title="New Arrivals" products={products} />
      {/* Popular this week */}
      <ProductSection title="Popular This Week" products={products} />
      <MembershipBanner />
      <BottomNavigation />
    </main>
  );
}
