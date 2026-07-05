import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";

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
    let query = supabase
      .from("products")
      .select(`*, categories!inner(id,name)`);
    query = query.eq("categories.name", category);
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
    <>
      <SearchBar />
      <CategoryFilter categories={safeCategories} />
      <section className="mt-3 px-5">
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 animate-fade-up">
          {safeProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
