import "server-only";

import { createServiceRoleClient } from "../supabase-server";
import { getProductStock } from "./products";
import type { CartItem } from "@/types/cart";

export async function addToCart(
  productId: string,
  quantity: number,
  telegramUserId: number,
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> {
  const supabase = createServiceRoleClient();

  // Validate stock before adding to cart
  const stock = await getProductStock(productId);
  if (stock === null) {
    return { success: false, error: "Product not found." };
  }
  if (stock <= 0) {
    return { success: false, error: "This product is out of stock." };
  }

  const { data: existingItem, error: selectError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", telegramUserId)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > stock) {
      return {
        success: false,
        error: `Only ${stock} item(s) available in stock.`,
      };
    }

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
      })
      .eq("id", existingItem.id)
      .eq("telegram_user_id", telegramUserId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }

  if (quantity > stock) {
    return {
      success: false,
      error: `Only ${stock} item(s) available in stock.`,
    };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      product_id: productId,
      quantity,
      telegram_user_id: telegramUserId,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "This item is already in your cart.",
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getCartItems(
  telegramUserId: number,
): Promise<
  | { success: true; data: CartItem[]; error: null }
  | { success: false; data: null; error: string }
> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
    id,
    quantity,
    products (
      id,
      name,
      image,
      price
    )
  `,
    )
    .eq("telegram_user_id", telegramUserId);

  if (error) {
    return { success: false, data: null, error: error.message };
  }
  return { success: true, data: (data ?? []) as CartItem[], error: null };
}

export async function getCartItemByProductId(
  productId: string,
  telegramUserId: number,
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", telegramUserId)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function removeFromCart(
  id: string,
  telegramUserId: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id)
    .eq("telegram_user_id", telegramUserId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateQuantity(
  id: string,
  quantity: number,
  telegramUserId: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = createServiceRoleClient();

  // Get the cart item to find the product_id
  const { data: cartItem, error: selectError } = await supabase
    .from("cart_items")
    .select("product_id")
    .eq("id", id)
    .eq("telegram_user_id", telegramUserId)
    .single();

  if (selectError || !cartItem) {
    return { success: false, error: "Cart item not found." };
  }

  // Validate stock
  const stock = await getProductStock(cartItem.product_id);
  if (stock === null) {
    return { success: false, error: "Product not found." };
  }
  if (quantity > stock) {
    return {
      success: false,
      error: `Only ${stock} item(s) available in stock.`,
    };
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
    .eq("telegram_user_id", telegramUserId);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getCartCount(
  telegramUserId: number,
): Promise<
  | { success: true; count: number; error: null }
  | { success: false; count: 0; error: string }
> {
  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("cart_items")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("telegram_user_id", telegramUserId);

  if (error) {
    return { success: false, count: 0, error: error.message };
  }
  return { success: true, count: count ?? 0, error: null };
}

// Cookie-based version for Server Components (non-cart pages like home page badge)
import { getTelegramUser } from "../telegram/get-telegram-user";

export async function getCartCountFromCookie(): Promise<
  | { success: true; count: number; error: null }
  | { success: false; count: 0; error: string }
> {
  const user = await getTelegramUser();
  if (!user) {
    return { success: true, count: 0, error: null };
  }

  const supabase = createServiceRoleClient();
  const { count, error } = await supabase
    .from("cart_items")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("telegram_user_id", user.id);

  if (error) {
    return { success: false, count: 0, error: error.message };
  }
  return { success: true, count: count ?? 0, error: null };
}
