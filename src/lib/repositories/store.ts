import { unstable_cache } from "next/cache";

import { supabase } from "../supabase";

// Store settings (name, logo, hero/promo images) change rarely; cache for
// 5 minutes to avoid a Supabase round-trip on every page render.
export const getStore = unstable_cache(
  async () => supabase.from("store_settings").select("*").single(),
  ["store"],
  { revalidate: 300, tags: ["store"] },
);
