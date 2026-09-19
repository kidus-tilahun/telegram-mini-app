"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/telegram/is-admin";
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
    await requireAdmin();
  } catch {
    return { success: false, error: "Admin access required" };
  }

  try {
    console.log("[AdminOrders] Creating service role client...");
    const supabase = createServiceRoleClient();
    console.log(
      "[AdminOrders] Service role client created, querying orders...",
    );

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
      console.error("[AdminOrders] Supabase error fetching orders:", error);
      return { success: false, error: error.message };
    }

    console.log(
      "[AdminOrders] Successfully fetched orders:",
      orders?.length || 0,
    );
    return { success: true, orders: orders ?? [] };
  } catch (error) {
    console.error("[AdminOrders] Unexpected error fetching orders:", error);
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
    await requireAdmin();
  } catch {
    return { success: false, error: "Admin access required" };
  }

  try {
    console.log("[AdminOrders] Updating order status:", { orderId, status });
    const supabase = createServiceRoleClient();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error(
        "[AdminOrders] Supabase error updating order status:",
        error,
      );
      return { success: false, error: error.message };
    }

    console.log("[AdminOrders] Successfully updated order status");
    return { success: true };
  } catch (error) {
    console.error(
      "[AdminOrders] Unexpected error updating order status:",
      error,
    );
    return { success: false, error: "Failed to update order status" };
  }
}
