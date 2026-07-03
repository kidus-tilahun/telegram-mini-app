import { supabase } from "@/lib/supabase";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    return <h1>Product not found</h1>;
  }
  return (
    <main>
      <h1>{product.name}</h1>
    </main>
  );
}
