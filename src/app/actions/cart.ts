"use server";

import { revalidatePath } from "next/cache";

import { TelegramAuthError } from "@/lib/telegram/errors";
import {
  addToCart,
  getCartItemByProductId,
  removeFromCart,
  updateQuantity,
} from "@/lib/repositories/cart";

type CartActionResult = { success: true } | { success: false; error: string };

function toCartActionResult(error: unknown): CartActionResult {
  if (error instanceof TelegramAuthError) {
    return {
      success: false,
      error: "Open this app in Telegram to manage your cart.",
    };
  }

  return {
    success: false,
    error: "Something went wrong. Please try again.",
  };
}

export async function addToCartAction(
  productId: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    const { data: existingItem } = await getCartItemByProductId(productId);

    if (existingItem) {
      await updateQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      await addToCart(productId, quantity);
    }

    revalidatePath("/cart");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return toCartActionResult(error);
  }
}

export async function updateQuantityAction(
  id: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    if (quantity <= 0) {
      await removeFromCart(id);
    } else {
      await updateQuantity(id, quantity);
    }

    revalidatePath("/cart");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return toCartActionResult(error);
  }
}

export async function removeFromCartAction(
  id: string,
): Promise<CartActionResult> {
  try {
    await removeFromCart(id);

    revalidatePath("/cart");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return toCartActionResult(error);
  }
}
