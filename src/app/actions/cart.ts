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
    const existingResult = await getCartItemByProductId(productId);

    if (!existingResult.success) {
      return { success: false, error: existingResult.error };
    }

    if (existingResult.data) {
      const updateResult = await updateQuantity(
        (existingResult.data as { id: string }).id,
        (existingResult.data as { quantity: number }).quantity + quantity,
      );
      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }
    } else {
      const insertResult = await addToCart(productId, quantity);
      if (!insertResult.success) {
        return { success: false, error: insertResult.error };
      }
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
    let result;
    if (quantity <= 0) {
      result = await removeFromCart(id);
    } else {
      result = await updateQuantity(id, quantity);
    }

    if (!result.success) {
      return { success: false, error: result.error };
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
    const result = await removeFromCart(id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    revalidatePath("/cart");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return toCartActionResult(error);
  }
}
