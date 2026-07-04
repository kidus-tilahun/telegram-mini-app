import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FeaturedProducts from "@/components/FeaturedProducts";

export default async function Home() {
  const [storeResult, productsResult] = await Promise.all([
    supabase.from("store_settings").select("*").single(),
    supabase.from("products").select(`*, categories (name)`),
  ]);

  const { data: store, error: storeError } = storeResult;
  const { data: products, error: productsError } = productsResult;

  if (storeError || productsError) {
    return <p>Failed to load data.</p>;
  }
  return (
    <main>
      <Header store={store} />
      <HeroBanner heroImageUrl={store.hero_image_url} />
      <FeaturedProducts products={products} />
    </main>
  );
}
