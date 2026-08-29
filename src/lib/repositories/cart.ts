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

export async function addToCart(productId: string, quantity: number) {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  const { data: existingItem, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", user.id)
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
      .eq("id", existingItem.id)
      .eq("telegram_user_id", user.id);
  }

  return supabase.from("cart_items").insert({
    product_id: productId,
    quantity,
    telegram_user_id: user.id,
  });
}

export async function getCartItems() {
  const telegramUserId = await getVerifiedTelegramUserId();
  if (telegramUserId === null) {
    return { data: [], error: null };
  }

  const supabase = createServiceRoleClient();

  return supabase
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
}

export async function getCartItemByProductId(productId: string) {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  return supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId)
    .eq("telegram_user_id", user.id)
    .maybeSingle();
}

export async function removeFromCart(id: string) {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  return supabase
    .from("cart_items")
    .delete()
    .eq("id", id)
    .eq("telegram_user_id", user.id);
}

export async function updateQuantity(id: string, quantity: number) {
  const user = await requireTelegramUser();
  const supabase = createServiceRoleClient();

  return supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", id)
    .eq("telegram_user_id", user.id);
}

export async function getCartCount() {
  const telegramUserId = await getVerifiedTelegramUserId();
  if (telegramUserId === null) {
    return {
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

  return {
    count: count ?? 0,
    error,
  };
}
