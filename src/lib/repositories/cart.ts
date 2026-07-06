import { supabase } from "../supabase";

export async function addToCart(productId: string, quantity: number) {
  return supabase
    .from("cart_items")
    .insert({ product_id: productId, quantity });
}

export async function getCartItems() {
  return supabase.from("cart_items").select(`*, products(*)`);
}

export async function removeFromCart(id: string) {
  return supabase.from("cart_items").delete().eq("id", id);
}

export async function updateQuantity(id: string, quantity: number) {
  return supabase.from("cart_items").update({ quantity }).eq("id", id);
}
