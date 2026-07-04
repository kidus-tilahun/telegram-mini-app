import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductSection from "@/components/ProductSection";
import CategoryChips from "@/components/CategoryChips";
import PromoBanner from "@/components/PromoBanner";
import CTA from "@/components/CTA";

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
      <PromoBanner imageUrl="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      {/* New arrivals */}
      <ProductSection title="New Arrivals" products={products} />
      {/* Popular this week */}
      <ProductSection title="Popular This Week" products={products} />
      <CTA />
    </main>
  );
}
