import { supabase } from "../supabase";

interface GetProductsOptions {
  featured?: boolean;
  search?: string;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}) {
  let query = supabase.from("products").select("*");

  // featured
  if (options.featured) {
    query = query.eq("featured", true);
  }

  // search
  if (options.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  // sort
  query = query.order("created_at", { ascending: false });

  // limit
  if (options.limit) {
    query = query.limit(options.limit);
  }
  return query;
}

export async function getProductsByCategory(slug: string, limit?: number) {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories!inner(
        slug
      )
    `,
    )
    .eq("categories.slug", slug);

  query = query.order("created_at", { ascending: false });
  if (limit) {
    query = query.limit(limit);
  }
  return await query;
}

export async function getProductById(id: string) {
  const query = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return query;
}

export async function getProductStock(id: string): Promise<number | null> {
  const { data, error } = await supabase
    .from("products")
    .select("stock")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data.stock;
}

export async function getRelatedProducts(
  categoryId: string,
  currentProductId: string,
) {
  const query = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .limit(4);
  return query;
}
