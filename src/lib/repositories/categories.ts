import { unstable_cache } from "next/cache";

import { supabase } from "../supabase";

// Categories change rarely (admin-managed); cache for 5 minutes.
export const getCategories = unstable_cache(
  async () => supabase.from("categories").select("*").order("sort_order"),
  ["categories"],
  { revalidate: 300, tags: ["categories"] },
);
