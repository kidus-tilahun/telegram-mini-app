"use server";

import { createServiceRoleClient } from "@/lib/supabase-server";

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
};

export async function getDashboardStatsAction(): Promise<
  { success: true; stats: DashboardStats } | { success: false; error: string }
> {
  try {
    const supabase = createServiceRoleClient();

    // Get total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Get total revenue
    const { data: revenueData } = await supabase.from("orders").select("total");

    const totalRevenue =
      revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    // Get total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // Get total categories
    const { count: totalCategories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      success: true,
      stats: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        pendingOrders: pendingOrders || 0,
        recentOrders: recentOrders || [],
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}
