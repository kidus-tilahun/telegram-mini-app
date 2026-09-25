import { unstable_cache } from "next/cache";

import { supabase } from "../supabase";

interface GetProductsOptions {
  featured?: boolean;
  search?: string;
  limit?: number;
}

// Read-only storefront queries are wrapped in unstable_cache so repeated
// page renders (and the home page's two getProducts calls) hit the Next.js
// data cache instead of Supabase every request. Arguments are part of the
// cache key, so different filters/limits produce separate entries.
// Revalidate keeps data fresh within 60s without touching mutation flows.
const PRODUCT_CACHE_OPTIONS = { revalidate: 60, tags: ["products"] };

async function getProductsQuery(options: GetProductsOptions = {}) {
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

export const getProducts = unstable_cache(
  async (options: GetProductsOptions = {}) => getProductsQuery(options),
  ["products"],
  PRODUCT_CACHE_OPTIONS,
);

async function getProductsByCategoryQuery(slug: string, limit?: number) {
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

export const getProductsByCategory = unstable_cache(
  async (slug: string, limit?: number) =>
    getProductsByCategoryQuery(slug, limit),
  ["products-by-category"],
  PRODUCT_CACHE_OPTIONS,
);

export const getProductById = unstable_cache(
  async (id: string) =>
    supabase.from("products").select("*").eq("id", id).single(),
  ["product"],
  PRODUCT_CACHE_OPTIONS,
);

// NOT cached: used inside cart/checkout mutation paths where stock must be
// read fresh on every call.
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

export const getRelatedProducts = unstable_cache(
  async (categoryId: string, currentProductId: string) =>
    supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .limit(4),
  ["related-products"],
  PRODUCT_CACHE_OPTIONS,
);
