"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import type { Tables } from "@/types/database";

export type AdminOrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
};

export type AdminOrder = Tables<"orders"> & {
  order_items: AdminOrderItem[];
};

export type GetAdminOrdersResult =
  | { success: true; orders: AdminOrder[] }
  | { success: false; error: string };

export async function getAdminOrdersAction(): Promise<GetAdminOrdersResult> {
  try {
    const supabase = createServiceRoleClient();

    const { data: orders, error } = await supabase
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

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, orders: orders ?? [] };
  } catch (error) {
    return { success: false, error: "Failed to fetch orders" };
  }
}

export type UpdateOrderStatusResult =
  | { success: true }
  | { success: false; error: string };

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<UpdateOrderStatusResult> {
  try {
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update order status" };
  }
}
