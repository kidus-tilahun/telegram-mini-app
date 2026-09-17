"use client";

import React, { useState, useEffect } from "react";

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

const statuses = ["All", "Pending", "Processing", "Completed", "Cancelled"];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

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
        alert(result.error || "Failed to update status");
      }
    } catch {
      // Revert on error
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status: order.status } : order,
        ),
      );
      alert("Failed to update status");
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatOrderId(id: string) {
    return `#${id.slice(-8)}`;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">View and manage customer orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Orders</h1>
            <p className="text-gray-500">View and manage customer orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-8 text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500">View and manage customer orders</p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full max-w-xs rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Orders" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="border-b p-4">
          <h2 className="font-semibold">Orders ({filteredOrders.length})</h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {formatOrderId(order.id)}
                      </td>
                      <td className="px-4 py-3">{order.customer_name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {order.order_items.length}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id,
                            )
                          }
                          className="text-primary-600 hover:underline text-sm"
                        >
                          {expandedOrder === order.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded order details */}
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium">{order.phone}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="font-medium text-sm">
                                  {order.delivery_address}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Checkout ID
                                </p>
                                <p className="font-medium text-sm font-mono">
                                  {order.checkout_id}
                                </p>
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <p className="text-sm font-medium mb-2">
                                Order Items
                              </p>
                              <div className="space-y-2">
                                {order.order_items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                                  >
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {item.product_name}
                                      </p>
                                      <p className="text-gray-500">
                                        Qty: {item.quantity} ×{" "}
                                        {formatCurrency(item.price)}
                                      </p>
                                    </div>
                                    <p className="font-medium ml-4">
                                      {formatCurrency(
                                        item.price * item.quantity,
                                      )}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="border-t pt-4">
                              <label className="block text-sm font-medium mb-2">
                                Update Status
                              </label>
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateStatus(order.id, e.target.value)
                                }
                                className="w-full max-w-xs rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
                              >
                                {statuses
                                  .filter((s) => s !== "All")
                                  .map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
