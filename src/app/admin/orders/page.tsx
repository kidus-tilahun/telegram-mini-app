"use client";

import { useState, useEffect } from "react";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatOrderId(id: string) {
    return `#${id.slice(-4)}`;
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage customer orders.
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Orders</h2>
          </div>
          <div className="p-10 text-center text-sm text-gray-500">
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage customer orders.
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold">Orders</h2>
          </div>
          <div className="p-10 text-center text-sm text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage customer orders.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Orders" : status}
            </option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="font-semibold">Orders ({filteredOrders.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-500">Order</th>

                <th className="px-5 py-3 font-medium text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-3 font-medium text-gray-500">Items</th>

                <th className="px-5 py-3 font-medium text-gray-500">Total</th>

                <th className="px-5 py-3 font-medium text-gray-500">Status</th>

                <th className="px-5 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold">
                    {formatOrderId(order.id)}
                  </td>

                  <td className="px-5 py-4">{order.customer_name}</td>

                  <td className="px-5 py-4 text-gray-600">
                    {order.order_items.length}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    ${order.total.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-lg border bg-white px-3 py-2 text-xs outline-none"
                    >
                      {statuses
                        .filter((status) => status !== "All")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
