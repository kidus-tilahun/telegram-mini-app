import { supabase } from "../supabase";

export async function getOrders() {
  return supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_id,
        product_name,
        price,
        quantity
      )
    `,
    )
    .order("created_at", { ascending: false });
}

export async function getOrderById(id: string) {
  return supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_id,
        product_name,
        price,
        quantity
      )
    `,
    )
    .eq("id", id)
    .single();
}
