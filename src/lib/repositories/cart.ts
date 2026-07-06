import { supabase } from "../supabase";

export async function addToCart(productId: string, quantity: number) {
  const { data: existingItem, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    return { error };
  }

  if (existingItem) {
    return supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("id", existingItem.id);
  }

  return supabase.from("cart_items").insert({
    product_id: productId,
    quantity,
  });
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
