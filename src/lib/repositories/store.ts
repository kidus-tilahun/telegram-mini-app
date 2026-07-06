import { supabase } from "../supabase";

export async function getStore() {
  return supabase.from("store_settings").select("*").single();
}
