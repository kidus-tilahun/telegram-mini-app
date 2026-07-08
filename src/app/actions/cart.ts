"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  getCartItemByProductId,
  removeFromCart,
  updateQuantity,
} from "@/lib/repositories/cart";

export async function addToCartAction(productId: string, quantity: number) {
  const { data: existingItem } = await getCartItemByProductId(productId);

  if (existingItem) {
    await updateQuantity(existingItem.id, existingItem.quantity + quantity);
  } else {
    await addToCart(productId, quantity);
  }

  revalidatePath("/cart");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function updateQuantityAction(id: string, quantity: number) {
  if (quantity <= 0) {
    await removeFromCart(id);
  } else {
    await updateQuantity(id, quantity);
  }

  revalidatePath("/cart");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function removeFromCartAction(id: string) {
  await removeFromCart(id);

  revalidatePath("/cart");
  revalidatePath("/shop");
  revalidatePath("/");
}
