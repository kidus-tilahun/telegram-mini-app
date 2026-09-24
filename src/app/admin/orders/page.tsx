"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MapPin, Phone, ShoppingBag } from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminListSkeleton from "@/components/admin/AdminListSkeleton";
import StatusBadge from "@/components/admin/StatusBadge";
import ErrorState from "@/components/ui/ErrorState";

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  total: number;
  status: string;
  created_at: string;
  telegram_user_id: number;
  checkout_id: string;
  order_items: OrderItem[];
};

const filterOptions = [
  "All",
  "Pending",
  "Processing",
  "Completed",
  "Cancelled",
];
const orderStatuses = ["Pending", "Processing", "Completed", "Cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<{
    orderId: string;
    message: string;
  } | null>(null);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status.toLowerCase() === filter.toLowerCase(),
        );

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/admin/orders");
        const result = await response.json();
        if (result.success) {
          setOrders(result.orders);
        } else {
          setError(result.error || "Failed to fetch orders");
        }
      } catch {
        setError("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function updateStatus(id: string, status: string) {
    setStatusError(null);
    setUpdatingOrderId(id);

    // Optimistic update
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    );

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status }),
      });
      const result = await response.json();
      if (!result.success) {
        // Revert on error
        setOrders((current) =>
          current.map((order) =>
            order.id === id ? { ...order, status: order.status } : order,
          ),
        );
        setStatusError({
          orderId: id,
          message: result.error || "Failed to update status",
        });
      }
    } catch {
      // Revert on error
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status: order.status } : order,
        ),
      );
      setStatusError({ orderId: id, message: "Failed to update status" });
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <AdminHeader
        title="Orders"
        description="View and manage customer orders"
      />

      {/* Status filter chips */}
      <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5">
        {filterOptions.map((status) => {
          const isActive = filter === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              aria-pressed={isActive}
              className={[
                "inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium transition-colors active:scale-[0.98]",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface-elevated text-foreground active:bg-muted",
              ].join(" ")}
            >
              {status === "All" ? "All Orders" : status}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <AdminListSkeleton rows={4} />
        ) : error ? (
          <ErrorState message={error} />
        ) : filteredOrders.length === 0 ? (
          <AdminEmptyState
            icon={ShoppingBag}
            title={
              filter === "All"
                ? "No orders yet"
                : `No ${filter.toLowerCase()} orders`
            }
            description={
              filter === "All"
                ? "New customer orders will appear here."
                : "Try a different status filter."
            }
          />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggle={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
              onUpdateStatus={updateStatus}
              isUpdating={updatingOrderId === order.id}
              statusError={
                statusError?.orderId === order.id ? statusError.message : null
              }
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </>
  );
}

// Order Card Component - Mobile-friendly card layout
function OrderCard({
  order,
  isExpanded,
  onToggle,
  onUpdateStatus,
  isUpdating,
  statusError,
  formatDate,
}: {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  isUpdating: boolean;
  statusError: string | null;
  formatDate: (dateString: string) => string;
}) {
  const itemCount = order.order_items.length;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      {/* Order summary - tap to expand */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors active:bg-muted/50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <p className="truncate text-sm font-medium text-foreground">
              #{order.id.slice(-8)}
            </p>
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {order.customer_name} · {formatDate(order.created_at)} · {itemCount}{" "}
            item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <p className="shrink-0 font-display text-base text-foreground tabular-nums">
          ETB {order.total.toLocaleString()}
        </p>
        <ChevronDown
          size={18}
          strokeWidth={1.8}
          aria-hidden
          className={`shrink-0 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="space-y-4 border-t border-border bg-surface/60 p-4">
          {/* Customer details */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-2.5">
              <Phone
                size={15}
                strokeWidth={1.8}
                aria-hidden
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Phone
                </p>
                <p className="mt-0.5 text-sm text-foreground">{order.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin
                size={15}
                strokeWidth={1.8}
                aria-hidden
                className="mt-0.5 shrink-0 text-muted-foreground"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Address
                </p>
                <p className="mt-0.5 text-sm text-foreground">
                  {order.delivery_address}
                </p>
              </div>
            </div>
          </div>

          {/* Order items */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Items
            </p>
            <div className="mt-2 divide-y divide-border/60 overflow-hidden rounded-xl border border-border bg-card">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {item.quantity} × ETB {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-foreground tabular-nums">
                    ETB {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout reference */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Checkout ID
            </p>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {order.checkout_id}
            </p>
          </div>

          {/* Status update */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Update Status
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {orderStatuses.map((status) => {
                const isCurrent =
                  order.status.toLowerCase() === status.toLowerCase();
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={isCurrent || isUpdating}
                    onClick={() => onUpdateStatus(order.id, status)}
                    className={[
                      "h-11 rounded-full text-sm font-medium transition-colors",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface-elevated text-foreground active:bg-muted disabled:opacity-50",
                    ].join(" ")}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
            {statusError && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
              >
                {statusError}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
