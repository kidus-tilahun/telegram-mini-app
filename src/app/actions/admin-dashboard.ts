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
    console.log("[AdminDashboard] Creating service role client...");
    const supabase = createServiceRoleClient();
    console.log(
      "[AdminDashboard] Service role client created, querying stats...",
    );

    // Get total orders
    const { count: totalOrders, error: ordersError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (ordersError) {
      console.error(
        "[AdminDashboard] Error fetching total orders:",
        ordersError,
      );
    }

    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from("orders")
      .select("total");
    if (revenueError) {
      console.error("[AdminDashboard] Error fetching revenue:", revenueError);
    }

    const totalRevenue =
      revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

    // Get total products
    const { count: totalProducts, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });
    if (productsError) {
      console.error("[AdminDashboard] Error fetching products:", productsError);
    }

    // Get total categories
    const { count: totalCategories, error: categoriesError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });
    if (categoriesError) {
      console.error(
        "[AdminDashboard] Error fetching categories:",
        categoriesError,
      );
    }

    // Get pending orders
    const { count: pendingOrders, error: pendingError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "Pending");
    if (pendingError) {
      console.error(
        "[AdminDashboard] Error fetching pending orders:",
        pendingError,
      );
    }

    // Get recent orders
    const { data: recentOrders, error: recentError } = await supabase
      .from("orders")
      .select("id, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    if (recentError) {
      console.error(
        "[AdminDashboard] Error fetching recent orders:",
        recentError,
      );
    }

    console.log("[AdminDashboard] Successfully fetched stats:", {
      totalOrders: totalOrders || 0,
      totalRevenue,
      totalProducts: totalProducts || 0,
      totalCategories: totalCategories || 0,
      pendingOrders: pendingOrders || 0,
      recentOrdersCount: recentOrders?.length || 0,
    });

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
    console.error("[AdminDashboard] Unexpected error fetching stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}
