import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const { data, error } = await supabase
    .from("products")
    .select(`*, categories (name)`)
    .eq("featured", true);

  if (error) {
    console.error(error);
    return <div>Failed to load products</div>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
