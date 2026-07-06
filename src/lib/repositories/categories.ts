import { supabase } from "../supabase";

export async function getCategories() {
  return supabase.from("categories").select("*").order("name");
}
