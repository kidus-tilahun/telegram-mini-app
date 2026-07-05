import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q, category } = await searchParams;
  let query = supabase.from("products").select("*");
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  // we will write this after wiring category slugs/names
  if (category) {
    // TODO
  }

  query = query.order("created_at", { ascending: false });

  const [
    { data: products, error: productsError },
    { data: categories, error: categoriesError },
  ] = await Promise.all([
    query,
    supabase.from("categories").select("*").order("name"),
  ]);

  if (productsError || categoriesError) {
    return <div>Failed to load shop.</div>;
  }
  const safeProducts = products ?? [];
  const safeCategories = categories ?? [];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <CategoryFilter categories={safeCategories} />
      {safeProducts?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
