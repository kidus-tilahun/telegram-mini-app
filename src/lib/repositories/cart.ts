import "server-only";

import { createServiceRoleClient } from "../supabase-server";
import {
  getTelegramUser,
  requireTelegramUser,
} from "../telegram/get-telegram-user";

async function getVerifiedTelegramUserId(): Promise<number | null> {
  const user = await getTelegramUser();
  return user?.id ?? null;
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  const { data: existingItem, error: selectError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", user.id)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  if (existingItem) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
      })
      .eq("id", existingItem.id)
      .eq("telegram_user_id", user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data };
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      product_id: productId,
      quantity,
      telegram_user_id: user.id,
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

export async function getCartItems() {
  const telegramUserId = await getVerifiedTelegramUserId();
  if (telegramUserId === null) {
    return { success: true, data: [], error: null };
  }

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
  return { success: true, data, error: null };
}

export async function getCartItemByProductId(
  productId: string,
): Promise<
  { success: true; data: unknown } | { success: false; error: string }
> {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", user.id)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function removeFromCart(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", id)
    .eq("telegram_user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function updateQuantity(
  id: string,
  quantity: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
    .eq("telegram_user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getCartCount() {
  const telegramUserId = await getVerifiedTelegramUserId();
  if (telegramUserId === null) {
    return {
      success: true,
      count: 0,
      error: null,
    };
  }

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
