"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Banknote, Clock, Package, ShoppingBag, Tags } from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";

type DashboardStats = {
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

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.error || "Failed to load dashboard");
        }
      } catch {
        setError("Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <>
        <AdminHeader
          title="Dashboard"
          description="Overview of your store performance"
        />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border bg-card"
            />
          ))}
        </div>
        <div className="mt-8 h-48 animate-pulse rounded-2xl border border-border bg-card" />
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <AdminHeader
          title="Dashboard"
          description="Overview of your store performance"
        />
        <div className="mt-6">
          <ErrorState message={error || "Failed to load dashboard"} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      {/* KPI grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingBag}
          href="/admin/orders"
        />
        <StatCard
          label="Total Revenue"
          value={`ETB ${stats.totalRevenue.toLocaleString()}`}
          icon={Banknote}
          href="/admin/orders"
        />
        <StatCard
          label="Products"
          value={stats.totalProducts.toString()}
          icon={Package}
          href="/admin/products"
        />
        <StatCard
          label="Categories"
          value={stats.totalCategories.toString()}
          icon={Tags}
          href="/admin/categories"
        />
      </div>

      {/* Pending orders alert */}
      {stats.pendingOrders > 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/25 bg-accent/10 p-4">
          <div
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent"
          >
            <Clock size={18} strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {stats.pendingOrders} order
              {stats.pendingOrders !== 1 ? "s" : ""} pending
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Review and update their status
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          >
            Review
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-display text-xl text-foreground">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-accent underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground"
            >
              <ShoppingBag size={24} strokeWidth={1.5} />
            </div>
            <p className="mt-4 font-display text-lg text-foreground">
              No orders yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              New customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders#${order.id}`}
                className="flex items-center gap-3 p-4 transition-colors active:bg-muted/50"
              >
                <div
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                >
                  <ShoppingBag size={16} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {order.customer_name} · {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm text-foreground tabular-nums">
                    ETB {order.total.toLocaleString()}
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
