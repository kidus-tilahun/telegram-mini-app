"use server";

import { revalidatePath } from "next/cache";

import { TelegramAuthError } from "@/lib/telegram/errors";
import {
  addToCart,
  getCartItemByProductId,
  removeFromCart,
  updateQuantity,
  getCartItems,
  getCartCount,
} from "@/lib/repositories/cart";
import { validateAndExtractUser } from "@/lib/telegram/get-telegram-user";

import type { CartItem } from "@/types/cart";

type CartActionResult = { success: true } | { success: false; error: string };

type GetCartItemsResult =
  | { success: true; data: CartItem[] }
  | { success: false; error: string };

type GetCartCountResult =
  | { success: true; count: number }
  | { success: false; error: string };

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

function validateInitDataAndGetUserId(initData: string): number {
  if (!initData?.trim()) {
    throw new TelegramAuthError();
  }

  const user = validateAndExtractUser(initData);
  if (!user) {
    throw new TelegramAuthError();
  }

  return user.id;
}

export async function addToCartAction(
  productId: string,
  quantity: number,
  initData: string,
): Promise<CartActionResult> {
  try {
    const telegramUserId = validateInitDataAndGetUserId(initData);

    const existingResult = await getCartItemByProductId(
      productId,
      telegramUserId,
    );

    if (!existingResult.success) {
      return { success: false, error: existingResult.error };
    }

    if (existingResult.data) {
      const updateResult = await updateQuantity(
        (existingResult.data as { id: string }).id,
        (existingResult.data as { quantity: number }).quantity + quantity,
        telegramUserId,
      );
      if (!updateResult.success) {
        return { success: false, error: updateResult.error };
      }
    } else {
      const insertResult = await addToCart(productId, quantity, telegramUserId);
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
  initData: string,
): Promise<CartActionResult> {
  try {
    const telegramUserId = validateInitDataAndGetUserId(initData);

    let result;
    if (quantity <= 0) {
      result = await removeFromCart(id, telegramUserId);
    } else {
      result = await updateQuantity(id, quantity, telegramUserId);
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
  initData: string,
): Promise<CartActionResult> {
  try {
    const telegramUserId = validateInitDataAndGetUserId(initData);

    const result = await removeFromCart(id, telegramUserId);

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

export async function getCartItemsAction(
  initData: string,
): Promise<GetCartItemsResult> {
  try {
    const telegramUserId = validateInitDataAndGetUserId(initData);
    const result = await getCartItems(telegramUserId);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return {
        success: false,
        error: "Open this app in Telegram to manage your cart.",
      };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getCartCountAction(
  initData: string,
): Promise<GetCartCountResult> {
  try {
    const telegramUserId = validateInitDataAndGetUserId(initData);
    const result = await getCartCount(telegramUserId);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, count: result.count };
  } catch (error) {
    if (error instanceof TelegramAuthError) {
      return {
        success: false,
        error: "Open this app in Telegram to manage your cart.",
      };
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
